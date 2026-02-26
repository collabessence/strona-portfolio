"""
OLX Scraper - Profesjonalny scraper ogłoszeń z OLX.pl
Wersja: 1.0
Gotowy produkt do sprzedania klientom!
"""

import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import requests
from bs4 import BeautifulSoup
import csv
import pandas as pd
from datetime import datetime
import threading
import re

class OLXScraperApp:
    def __init__(self, root):
        self.root = root
        self.root.title("OLX Scraper Pro - Zbieranie Ogłoszeń")
        self.root.geometry("800x600")
        self.root.configure(bg='#f0f0f0')
        
        self.results = []
        self.is_scraping = False
        
        self.setup_ui()
    
    def setup_ui(self):
        # Header
        header = tk.Frame(self.root, bg='#002f34', height=80)
        header.pack(fill=tk.X, padx=0, pady=0)
        
        title = tk.Label(header, text="🔍 OLX Scraper Pro", 
                        font=('Arial', 20, 'bold'), 
                        bg='#002f34', fg='white')
        title.pack(pady=20)
        
        # Main container
        main_frame = tk.Frame(self.root, bg='#f0f0f0')
        main_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=20)
        
        # Input section
        input_frame = tk.LabelFrame(main_frame, text="Parametry wyszukiwania", 
                                   font=('Arial', 12, 'bold'),
                                   bg='#f0f0f0', padx=10, pady=10)
        input_frame.pack(fill=tk.X, pady=(0, 10))
        
        # URL input
        tk.Label(input_frame, text="URL kategorii OLX:", 
                bg='#f0f0f0', font=('Arial', 10)).grid(row=0, column=0, sticky='w', pady=5)
        
        self.url_entry = tk.Entry(input_frame, width=60, font=('Arial', 10))
        self.url_entry.grid(row=0, column=1, padx=10, pady=5)
        self.url_entry.insert(0, "https://www.olx.pl/elektronika/")
        
        # Pages input
        tk.Label(input_frame, text="Liczba stron:", 
                bg='#f0f0f0', font=('Arial', 10)).grid(row=1, column=0, sticky='w', pady=5)
        
        self.pages_spinbox = tk.Spinbox(input_frame, from_=1, to=50, 
                                       width=10, font=('Arial', 10))
        self.pages_spinbox.grid(row=1, column=1, sticky='w', padx=10, pady=5)
        
        # Keyword filter
        tk.Label(input_frame, text="Filtr słów kluczowych (opcjonalnie):", 
                bg='#f0f0f0', font=('Arial', 10)).grid(row=2, column=0, sticky='w', pady=5)
        
        self.keyword_entry = tk.Entry(input_frame, width=60, font=('Arial', 10))
        self.keyword_entry.grid(row=2, column=1, padx=10, pady=5)
        
        # Control buttons
        button_frame = tk.Frame(main_frame, bg='#f0f0f0')
        button_frame.pack(fill=tk.X, pady=10)
        
        self.start_btn = tk.Button(button_frame, text="▶ Rozpocznij Scraping", 
                                   command=self.start_scraping,
                                   bg='#23e5db', fg='black', 
                                   font=('Arial', 12, 'bold'),
                                   padx=20, pady=10, cursor='hand2')
        self.start_btn.pack(side=tk.LEFT, padx=5)
        
        self.export_csv_btn = tk.Button(button_frame, text="💾 Eksport CSV", 
                                        command=self.export_csv,
                                        bg='#4CAF50', fg='white', 
                                        font=('Arial', 11, 'bold'),
                                        padx=15, pady=10, cursor='hand2',
                                        state=tk.DISABLED)
        self.export_csv_btn.pack(side=tk.LEFT, padx=5)
        
        self.export_excel_btn = tk.Button(button_frame, text="📊 Eksport Excel", 
                                          command=self.export_excel,
                                          bg='#2196F3', fg='white', 
                                          font=('Arial', 11, 'bold'),
                                          padx=15, pady=10, cursor='hand2',
                                          state=tk.DISABLED)
        self.export_excel_btn.pack(side=tk.LEFT, padx=5)
        
        # Progress bar
        self.progress = ttk.Progressbar(main_frame, mode='indeterminate')
        self.progress.pack(fill=tk.X, pady=5)
        
        # Status label
        self.status_label = tk.Label(main_frame, text="Gotowy do pracy", 
                                     bg='#f0f0f0', font=('Arial', 10),
                                     fg='#666')
        self.status_label.pack(pady=5)
        
        # Results section
        results_frame = tk.LabelFrame(main_frame, text="Znalezione ogłoszenia", 
                                     font=('Arial', 12, 'bold'),
                                     bg='#f0f0f0', padx=5, pady=5)
        results_frame.pack(fill=tk.BOTH, expand=True)
        
        # Treeview for results
        columns = ('Tytuł', 'Cena', 'Lokalizacja', 'Data')
        self.tree = ttk.Treeview(results_frame, columns=columns, show='headings', height=15)
        
        for col in columns:
            self.tree.heading(col, text=col)
            self.tree.column(col, width=150)
        
        # Scrollbar
        scrollbar = ttk.Scrollbar(results_frame, orient=tk.VERTICAL, command=self.tree.yview)
        self.tree.configure(yscroll=scrollbar.set)
        
        self.tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Counter label
        self.counter_label = tk.Label(main_frame, text="Znaleziono: 0 ogłoszeń", 
                                     bg='#f0f0f0', font=('Arial', 10, 'bold'),
                                     fg='#002f34')
        self.counter_label.pack(pady=5)
    
    def start_scraping(self):
        if self.is_scraping:
            messagebox.showwarning("Uwaga", "Scraping już trwa!")
            return
        
        url = self.url_entry.get().strip()
        if not url:
            messagebox.showerror("Błąd", "Podaj URL kategorii OLX!")
            return
        
        try:
            pages = int(self.pages_spinbox.get())
        except ValueError:
            messagebox.showerror("Błąd", "Podaj prawidłową liczbę stron!")
            return
        
        # Clear previous results
        for item in self.tree.get_children():
            self.tree.delete(item)
        self.results = []
        
        # Start scraping in separate thread
        self.is_scraping = True
        self.start_btn.config(state=tk.DISABLED)
        self.export_csv_btn.config(state=tk.DISABLED)
        self.export_excel_btn.config(state=tk.DISABLED)
        self.progress.start()
        
        thread = threading.Thread(target=self.scrape_olx, args=(url, pages))
        thread.daemon = True
        thread.start()
    
    def scrape_olx(self, base_url, pages):
        keyword = self.keyword_entry.get().strip().lower()
        
        self.update_status(f"Rozpoczynam scraping... (0/{pages} stron)")
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        for page in range(1, pages + 1):
            try:
                # Construct URL with page parameter
                if '?' in base_url:
                    url = f"{base_url}&page={page}"
                else:
                    url = f"{base_url}?page={page}"
                
                self.update_status(f"Pobieram stronę {page}/{pages}...")
                
                response = requests.get(url, headers=headers, timeout=10)
                
                if response.status_code != 200:
                    self.update_status(f"Błąd: Strona {page} zwróciła kod {response.status_code}")
                    continue
                
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Find listings - OLX structure (może wymagać aktualizacji)
                listings = soup.find_all('div', {'data-cy': 'l-card'})
                
                if not listings:
                    # Try alternative selectors
                    listings = soup.find_all('div', class_=re.compile('offer-wrapper|css-.*'))
                
                for listing in listings:
                    try:
                        # Extract title
                        title_elem = listing.find('h6') or listing.find('h4') or listing.find('strong')
                        title = title_elem.get_text(strip=True) if title_elem else 'Brak tytułu'
                        
                        # Keyword filter
                        if keyword and keyword not in title.lower():
                            continue
                        
                        # Extract price
                        price_elem = listing.find('p', {'data-testid': 'ad-price'})
                        if not price_elem:
                            price_elem = listing.find('span', class_=re.compile('price'))
                        price = price_elem.get_text(strip=True) if price_elem else 'Brak ceny'
                        
                        # Extract location
                        location_elem = listing.find('p', {'data-testid': 'location-date'})
                        if not location_elem:
                            location_elem = listing.find('span', class_=re.compile('location'))
                        location = location_elem.get_text(strip=True) if location_elem else 'Brak lokalizacji'
                        location = location.split('-')[0].strip() if '-' in location else location
                        
                        # Extract date
                        date = 'Brak daty'
                        if location_elem:
                            full_text = location_elem.get_text(strip=True)
                            if '-' in full_text:
                                date = full_text.split('-')[-1].strip()
                        
                        # Extract URL
                        link_elem = listing.find('a', href=True)
                        link = link_elem['href'] if link_elem else ''
                        if link and not link.startswith('http'):
                            link = 'https://www.olx.pl' + link
                        
                        result = {
                            'Tytuł': title,
                            'Cena': price,
                            'Lokalizacja': location,
                            'Data': date,
                            'Link': link
                        }
                        
                        self.results.append(result)
                        self.root.after(0, self.add_to_tree, result)
                        
                    except Exception as e:
                        print(f"Błąd przetwarzania ogłoszenia: {e}")
                        continue
                
                self.update_status(f"Ukończono stronę {page}/{pages} - Znaleziono: {len(self.results)}")
                
            except requests.exceptions.RequestException as e:
                self.update_status(f"Błąd połączenia na stronie {page}: {str(e)}")
                continue
            except Exception as e:
                self.update_status(f"Błąd na stronie {page}: {str(e)}")
                continue
        
        self.scraping_finished()
    
    def add_to_tree(self, result):
        self.tree.insert('', tk.END, values=(
            result['Tytuł'][:50] + '...' if len(result['Tytuł']) > 50 else result['Tytuł'],
            result['Cena'],
            result['Lokalizacja'],
            result['Data']
        ))
        self.counter_label.config(text=f"Znaleziono: {len(self.results)} ogłoszeń")
    
    def update_status(self, message):
        self.root.after(0, lambda: self.status_label.config(text=message))
    
    def scraping_finished(self):
        self.root.after(0, self._finish_scraping)
    
    def _finish_scraping(self):
        self.progress.stop()
        self.is_scraping = False
        self.start_btn.config(state=tk.NORMAL)
        
        if self.results:
            self.export_csv_btn.config(state=tk.NORMAL)
            self.export_excel_btn.config(state=tk.NORMAL)
            self.status_label.config(text=f"✅ Zakończono! Znaleziono {len(self.results)} ogłoszeń")
            messagebox.showinfo("Sukces", f"Scraping zakończony!\n\nZnaleziono: {len(self.results)} ogłoszeń")
        else:
            self.status_label.config(text="❌ Nie znaleziono ogłoszeń")
            messagebox.showwarning("Uwaga", "Nie znaleziono żadnych ogłoszeń.\n\nSprawdź URL lub parametry.")
    
    def export_csv(self):
        if not self.results:
            messagebox.showwarning("Uwaga", "Brak danych do eksportu!")
            return
        
        filename = filedialog.asksaveasfilename(
            defaultextension=".csv",
            filetypes=[("CSV files", "*.csv"), ("All files", "*.*")],
            initialfile=f"olx_scraping_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        )
        
        if filename:
            try:
                with open(filename, 'w', newline='', encoding='utf-8-sig') as f:
                    writer = csv.DictWriter(f, fieldnames=['Tytuł', 'Cena', 'Lokalizacja', 'Data', 'Link'])
                    writer.writeheader()
                    writer.writerows(self.results)
                
                messagebox.showinfo("Sukces", f"Dane wyeksportowane do:\n{filename}")
            except Exception as e:
                messagebox.showerror("Błąd", f"Nie udało się zapisać pliku:\n{str(e)}")
    
    def export_excel(self):
        if not self.results:
            messagebox.showwarning("Uwaga", "Brak danych do eksportu!")
            return
        
        filename = filedialog.asksaveasfilename(
            defaultextension=".xlsx",
            filetypes=[("Excel files", "*.xlsx"), ("All files", "*.*")],
            initialfile=f"olx_scraping_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
        )
        
        if filename:
            try:
                df = pd.DataFrame(self.results)
                df.to_excel(filename, index=False, engine='openpyxl')
                
                messagebox.showinfo("Sukces", f"Dane wyeksportowane do:\n{filename}")
            except Exception as e:
                messagebox.showerror("Błąd", f"Nie udało się zapisać pliku:\n{str(e)}")


def main():
    root = tk.Tk()
    app = OLXScraperApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
