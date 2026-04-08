import requests
import sys

def search_ticker(query):
    url = f"https://query2.finance.yahoo.com/v1/finance/search?q={query}"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    try:
        response = requests.get(url, headers=headers)
        data = response.json()
        
        # Extract name and symbol
        if "quotes" in data and len(data["quotes"]) > 0:
            print(f"Results for '{query}':")
            for quote in data["quotes"][:3]: # Show top 3 results
                symbol = quote.get("symbol")
                name = quote.get("shortname", quote.get("longname", "Unknown"))
                exchange = quote.get("exchange")
                print(f" - {name} [Ticker: {symbol}] on {exchange}")
        else:
            print("No results found.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    search_ticker("HDFC")
    print("-" * 20)
    search_ticker("JPMorgan")
