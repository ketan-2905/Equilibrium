import os
import json
import requests
import time

SIMULATIONS_DIR = "frontend/src/data/simulations"

def get_ticker_for_name(name):
    print(f"Resolving ticker for: {name}...")
    url = f"https://query2.finance.yahoo.com/v1/finance/search?q={name}"
    headers = {'User-Agent': 'Mozilla/5.0'}
    try:
        response = requests.get(url, headers=headers)
        data = response.json()
        if "quotes" in data and len(data["quotes"]) > 0:
            # Prefer .NS (NSE) for Indian banks if available, else take the first one
            quotes = data["quotes"]
            indian_quotes = [q for q in quotes if q.get("symbol", "").endswith(".NS")]
            best_match = indian_quotes[0] if indian_quotes else quotes[0]
            
            ticker = best_match.get("symbol")
            print(f" -> Found: {ticker}")
            return ticker
    except Exception as e:
        print(f"Error resolving {name}: {e}")
    return None

def process_simulations():
    if not os.path.exists(SIMULATIONS_DIR):
        print(f"Directory {SIMULATIONS_DIR} not found.")
        return

    for filename in os.listdir(SIMULATIONS_DIR):
        if filename.endswith(".json"):
            filepath = os.path.join(SIMULATIONS_DIR, filename)
            with open(filepath, 'r') as f:
                try:
                    sim_data = json.load(f)
                except:
                    continue

            modified = False
            if "nodes" in sim_data:
                for node in sim_data["nodes"]:
                    # If ticker is missing, placeholder, or needs update
                    label = node.get("data", {}).get("label", "")
                    current_ticker = node.get("data", {}).get("ticker", "")
                    
                    if label and (not current_ticker or current_ticker == "TICKER"):
                        new_ticker = get_ticker_for_name(label)
                        if new_ticker:
                            node["data"]["ticker"] = new_ticker
                            modified = True
                        # Sleep briefly to avoid rate limits
                        time.sleep(0.5)

            if modified:
                with open(filepath, 'w') as f:
                    json.dump(sim_data, f, indent=4)
                print(f"Updated {filename}")

if __name__ == "__main__":
    process_simulations()
