from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import os

# -------------------------------
# CONFIG
# -------------------------------
TERMINAL_URLS = [
    "https://www.amc.af.mil/AMC-Travel-Site/Terminals/CONUS-Terminals/Baltimore-Washington-International-Airport-Passenger-Terminal/",
    "https://www.amc.af.mil/AMC-Travel-Site/Terminals/CONUS-Terminals/Dover-AFB-Passenger-Terminal/",
    "https://www.amc.af.mil/AMC-Travel-Site/Terminals/CONUS-Terminals/Fairchild-AFB-Air-Transportation-Function/","https://www.amc.af.mil/AMC-Travel-Site/Terminals/CONUS-Terminals/Joint-Base-Andrews-Passenger-Terminal/","https://www.amc.af.mil/AMC-Travel-Site/Terminals/CONUS-Terminals/Joint-Base-Charleston-Passenger-Terminal/","https://www.amc.af.mil/AMC-Travel-Site/Terminals/CONUS-Terminals/Joint-Base-Lewis-McChord-Passenger-Terminal/","https://www.amc.af.mil/AMC-Travel-Site/Terminals/CONUS-Terminals/Joint-Base-MDL-Passenger-Terminal/","https://www.amc.af.mil/AMC-Travel-Site/Terminals/CONUS-Terminals/Little-Rock-AFB-Passenger-Terminal/","https://www.amc.af.mil/AMC-Travel-Site/Terminals/CONUS-Terminals/MacDill-AFB-Air-Transportation-Function/","https://www.amc.af.mil/AMC-Travel-Site/Terminals/CONUS-Terminals/McConnell-AFB-Air-Transportation-Function/","https://www.amc.af.mil/AMC-Travel-Site/Terminals/CONUS-Terminals/NAS-Jacksonville-Passenger-Terminal/","https://www.amc.af.mil/AMC-Travel-Site/Terminals/CONUS-Terminals/NS-Norfolk-Passenger-Terminal/","https://www.amc.af.mil/AMC-Travel-Site/Terminals/CONUS-Terminals/Pope-Army-Airfield-Passenger-Terminal/","https://www.amc.af.mil/AMC-Travel-Site/Terminals/CONUS-Terminals/Scott-AFB-Air-Transportation-Function/","https://www.amc.af.mil/AMC-Travel-Site/Terminals/CONUS-Terminals/Seattle-Tacoma-International-Gateway/",  "https://www.amc.af.mil/AMC-Travel-Site/Terminals/CONUS-Terminals/Travis-AFB-Passenger-Terminal/",

]

DATA_DIR = "data"
os.makedirs(DATA_DIR, exist_ok=True)

# -------------------------------
# Helper: derive filename from URL
# -------------------------------
def terminal_name_from_url(url: str) -> str:
    # Take last part of path (like "Baltimore-Washington-International-Airport-Passenger-Terminal")
    part = urlparse(url).path.strip("/").split("/")[-1]
    # Simplify (BWI, Travis, etc.)
    name = (
        part.replace("-Passenger-Terminal", "")
        .replace("Air-Force-Base", "")
        .replace("Airport", "")
        .replace("-", "_")
        .lower()
    )
    return name


# -------------------------------
# Download PDF for one terminal
# -------------------------------
def download_pdf_for_terminal(page_url: str):
    base_name = terminal_name_from_url(page_url)
    out_html = f"{DATA_DIR}/{base_name}.html"
    out_pdf = f"{DATA_DIR}/{base_name}_30day.pdf"

    print(f"Processing {base_name.upper()} ===")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(accept_downloads=True)
        page = context.new_page()

        page.goto(page_url, wait_until="domcontentloaded", timeout=90_000)
        html = page.content()

        # Save HTML for debugging (optional)
        with open(out_html, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"Saved HTML {out_html}")

        # Find PDF link
        soup = BeautifulSoup(html, "html.parser")
        img = soup.find("img", alt="30-day schedule Blue.jpg")
        if not img:
            print("Could not find 30-day schedule image, skipping.")
            browser.close()
            return

        link = img.find_parent("a")
        if not link or not link.get("href"):
            print("No href found for 30-day schedule link, skipping.")
            browser.close()
            return

        pdf_url = urljoin(page_url, link["href"])
        print(f"Downloading from: {pdf_url}")

        # Download file
        try:
            with page.expect_download() as download_info:
                page.evaluate(f"window.open('{pdf_url}', '_blank');")
            download = download_info.value
            download.save_as(out_pdf)
            print(f" Saved PDF{out_pdf}")
        except Exception as e:
            print(f" Failed to download {base_name}: {e}")

        browser.close()

        # Optional cleanup of HTML file
        if os.path.exists(out_html):
            os.remove(out_html)
            print(f"Deleted temp HTML {out_html}")


# -------------------------------
# Main
# -------------------------------
def main():
    for url in TERMINAL_URLS:
        download_pdf_for_terminal(url)

    print(" All downloads complete.\nFiles saved in:", os.path.abspath(DATA_DIR))


if __name__ == "__main__":
    main()
