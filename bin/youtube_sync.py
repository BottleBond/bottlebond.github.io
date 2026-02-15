import os
import requests
from pathlib import Path
from dateutil import parser as dateparser

API_KEY = os.environ.get("YOUTUBE_API_KEY")
CHANNEL_ID = os.environ.get("YOUTUBE_CHANNEL_ID")  # set this in your env
VIDEOS_MD_PATH = Path("videos.md")  # or docs/videos.md for MkDocs

SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"
VIDEOS_URL = "https://www.googleapis.com/youtube/v3/videos"

def get_uploads(channel_id):
    # Use search to get recent videos; for full history you can walk uploads playlist. [web:21][web:23]
    params = {
        "key": API_KEY,
        "channelId": channel_id,
        "part": "snippet",
        "order": "date",
        "maxResults": 50,
        "type": "video",
    }
    resp = requests.get(SEARCH_URL, params=params, timeout=10)
    resp.raise_for_status()
    data = resp.json()
    return data["items"]

def get_video_details(video_ids):
    params = {
        "key": API_KEY,
        "id": ",".join(video_ids),
        "part": "snippet,contentDetails",
        "maxResults": 50,
    }
    resp = requests.get(VIDEOS_URL, params=params, timeout=10)
    resp.raise_for_status()
    return resp.json()["items"]

def summarize_description(desc: str, max_chars=200) -> str:
    if not desc:
        return ""
    desc = desc.strip().replace("\n", " ")
    if len(desc) <= max_chars:
        return desc
    return desc[: max_chars - 3].rsplit(" ", 1)[0] + "..."

def write_markdown(videos):
    lines = []
    lines.append("# Bottle Bond Videos")
    lines.append("")
    lines.append("Curated episodes from the Bottle Bond YouTube channel, with link-out summaries for easy browsing.")
    lines.append("")

    for v in videos:
        snippet = v["snippet"]
        vid = v["id"]
        video_id = vid["videoId"]
        title = snippet["title"]
        published = dateparser.parse(snippet["publishedAt"]).date().isoformat()
        url = f"https://www.youtube.com/watch?v={video_id}"

        # A small summary from description
        desc = snippet.get("description", "")
        short = summarize_description(desc)

        lines.append(f"## {title}")
        lines.append(f"- Date: {published}")
        lines.append(f"- Watch: [{url}]({url})")
        if short:
            lines.append(f"- Summary: {short}")
        lines.append("")

    VIDEOS_MD_PATH.write_text("\n".join(lines), encoding="utf-8")

def main():
    if not API_KEY or not CHANNEL_ID:
        raise SystemExit("Set YOUTUBE_API_KEY and YOUTUBE_CHANNEL_ID env vars.")
    items = get_uploads(CHANNEL_ID)
    # For more detailed stats you could call get_video_details, but snippet is enough to build summaries. [web:17][web:21]
    write_markdown(items)

if __name__ == "__main__":
    main()
