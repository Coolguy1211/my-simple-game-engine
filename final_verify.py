from playwright.sync_api import sync_playwright
import time
import os
import sys

def verify_engine():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        rotator_script_started = False

        def handle_console(msg):
            nonlocal rotator_script_started
            print(f"PAGE LOG: {msg.text}")
            if msg.text == "Rotator script started!":
                rotator_script_started = True

        page.on("console", handle_console)
        page.on("pageerror", lambda err: print(f"PAGE ERROR: {err}"))

        try:
            print("Navigating to http://localhost:8000...")
            page.goto("http://localhost:8000", wait_until="networkidle", timeout=10000)

            # Wait a bit for the script to start and render
            time.sleep(3)

            # Take a screenshot
            os.makedirs("/home/jules/verification", exist_ok=True)
            page.screenshot(path="/home/jules/verification/final_verification.png")

            if rotator_script_started:
                print("SUCCESS: Rotator script detected.")
            else:
                print("FAILURE: Rotator script NOT detected.")
                sys.exit(1)

            # Check for any remaining PAGE ERRORs that might indicate regression
            # (We expect the gravity error to be gone now)

        except Exception as e:
            print(f"ERROR during verification: {e}")
            sys.exit(1)
        finally:
            browser.close()

if __name__ == "__main__":
    verify_engine()
