import re
import urllib.parse
from pathlib import Path

import requests
from bs4 import BeautifulSoup
from markdownify import markdownify as md

BASE_URL = "https://bottle.bond"
START_PATH = "/"  # starting path relative to BASE_URL
OUTPUT_ROOT = Path("docs")  # where Markdown files will be written

session = requests.Session()


def fetch(url: str) -> str:
    resp = session.get(url, timeout=10)
    resp.raise_for_status()
    return resp.text


def html_to_markdown(html: str) -> str:
    return md(html, heading_style="ATX")


def url_to_path(url: str) -> Path:
    """
    Map a site URL to a local markdown path under OUTPUT_ROOT.

    Examples:
      https://bottle.bond/               -> docs/index.md
      https://bottle.bond/prohibition/   -> docs/prohibition/index.md
      https://bottle.bond/about          -> docs/about.md
    """
    parsed = urllib.parse.urlparse(url)

    # strip query and fragment
    path = parsed.path

    if path in ("", "/"):
        return OUTPUT_ROOT / "index.md"

    # normalize trailing slash: directories get index.md
    if path.endswith("/"):
        local_dir = OUTPUT_ROOT / path.lstrip("/")
        return local_dir / "index.md"

    # if it looks like it already has an extension, swap to .md
    if "." in Path(path).name:
        stem = Path(path).with_suffix("").name
        parent = Path(path).parent
        return OUTPUT_ROOT / parent.as_posix().lstrip("/") / f"{stem}.md"

    # otherwise treat as a simple slug
    return OUTPUT_ROOT / f"{path.lstrip('/')}.md"


def is_internal_link(href: str) -> bool:
    if not href:
        return False
    parsed = urllib.parse.urlparse(href)

    # fragment-only links like "#section"
    if not parsed.netloc and not parsed.path:
        return False

    # absolute on same domain
    if parsed.netloc and parsed.netloc != urllib.parse.urlparse(BASE_URL).netloc:
        return False

    # anything with no netloc is relative and thus internal
    return True


def normalize_link(href: str, current_url: str) -> str:
    """
    Turn relative or fragmenty href into an absolute URL under BASE_URL.
    """
    if not href:
        return ""
    # join relative to current page first
    abs_url = urllib.parse.urljoin(current_url, href)
    # force scheme+netloc from BASE_URL (guard against protocol-relative, etc.)
    base_parsed = urllib.parse.urlparse(BASE_URL)
    parsed = urllib.parse.urlparse(abs_url)
    if parsed.netloc and parsed.netloc != base_parsed.netloc:
        # external – leave as is for content, but won't be crawled further
        return abs_url
    # rebuild with base domain to keep things consistent
    return urllib.parse.urlunparse(
        (
            base_parsed.scheme,
            base_parsed.netloc,
            parsed.path or "/",
            "",  # params
            parsed.query,
            parsed.fragment,
        )
    )


def extract_links(html: str, page_url: str) -> set[str]:
    soup = BeautifulSoup(html, "html.parser")
    links = set()
    for a in soup.find_all("a", href=True):
        href = a.get("href")
        if not is_internal_link(href):
            continue
        abs_url = normalize_link(href, page_url)
        # strip fragments so /foo#bar -> /foo
        parsed = urllib.parse.urlparse(abs_url)
        cleaned = urllib.parse.urlunparse(
            (parsed.scheme, parsed.netloc, parsed.path, "", parsed.query, "")
        )
        # only crawl bottle.bond
        if cleaned.startswith(BASE_URL):
            links.add(cleaned)
    return links


def save_markdown(url: str, html: str) -> None:
    markdown = html_to_markdown(html)
    out_path = url_to_path(url)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(markdown, encoding="utf-8")
    print(f"Saved {url} -> {out_path}")


def crawl(start_url: str) -> None:
    to_visit = {start_url}
    visited = set()

    while to_visit:
        current = to_visit.pop()
        if current in visited:
            continue
        visited.add(current)

        try:
            print(f"Fetching {current}")
            html = fetch(current)
        except Exception as e:
            print(f"Error fetching {current}: {e}")
            continue

        # save current page
        save_markdown(current, html)

        # discover more internal links
        new_links = extract_links(html, current)
        # only add links we haven't processed yet
        to_visit |= (new_links - visited)


def main():
    start_url = urllib.parse.urljoin(BASE_URL, START_PATH)
    crawl(start_url)


if __name__ == "__main__":
    main()
