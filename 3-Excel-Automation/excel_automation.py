"""
Excel Automation Tool - Narzędzie do automatyzacji Excel
Wersja: 1.0
Gotowy produkt do sprzedania!
"""

import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import pandas as pd
import os
from datetime import datetime
import threading

class ExcelAutomationApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Excel Automation Pro - Automatyzacja Plików Excel")
        self.root.geometry("900x700")
        self.root.configure(bg='#f0f0f0')
        
        self.files = []
        self.dataframes = {}
        
        self.setup_ui()
    
    def setup_ui(self):
        # Header
        header = tk.Frame(self.root, bg='#2c3e50', height=80)
        header.pack(fill=tk.X)
        
        title = tk.Label(header, text="📊 Excel Automation Pro", 
                        font=('Arial', 22, 'bold'), 
                        bg='#2c3e50', fg='white')
        title.pack(pady=20)
        
        # Main container
        main_frame = tk.Frame(self.root, bg='#f0f0f0')
        main_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=20)
        
        # Notebook (tabs)
        self.notebook = ttk.Notebook(main_frame)
        self.notebook.pack(fill=tk.BOTH, expand=True)
        
        # Tabs
        self.create_merge_tab()
        self.create_filter_tab()
        self.create_analyze_tab()
        self.create_convert_tab()
    
    def create_merge_tab(self):
        """Tab do łączenia plików Excel"""
        tab = tk.Frame(self.notebook, bg='#f0f0f0')
        self.notebook.add(tab, text="  Łączenie Plików  ")
        
        # Description
        desc = tk.Label(tab, text="Połącz wiele plików Excel w jeden", 
                       font=('Arial', 12, 'bold'), bg='#f0f0f0')
        desc.pack(pady=10)
        
        # File selection frame
        file_frame = tk.LabelFrame(tab, text="Wybrane pliki", 
                                  font=('Arial', 11, 'bold'),
                                  bg='#f0f0f0', padx=10, pady=10)
        file_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Listbox for files
        self.merge_listbox = tk.Listbox(file_frame, height=10, 
                                       font=('Arial', 10))
        self.merge_listbox.pack(fill=tk.BOTH, expand=True, side=tk.LEFT)
        
        scrollbar = ttk.Scrollbar(file_frame, orient=tk.VERTICAL, 
                                 command=self.merge_listbox.yview)
        self.merge_listbox.configure(yscrollcommand=scrollbar.set)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Buttons frame
        btn_frame = tk.Frame(tab, bg='#f0f0f0')
        btn_frame.pack(fill=tk.X, padx=10, pady=10)
        
        tk.Button(btn_frame, text="📁 Dodaj Pliki", 
                 command=self.add_files_to_merge,
                 bg='#3498db', fg='white', 
                 font=('Arial', 11, 'bold'),
                 padx=20, pady=10, cursor='hand2').pack(side=tk.LEFT, padx=5)
        
        tk.Button(btn_frame, text="🗑 Usuń Zaznaczony", 
                 command=self.remove_file_from_merge,
                 bg='#e74c3c', fg='white', 
                 font=('Arial', 11, 'bold'),
                 padx=20, pady=10, cursor='hand2').pack(side=tk.LEFT, padx=5)
        
        tk.Button(btn_frame, text="🔗 Połącz Pliki", 
                 command=self.merge_files,
                 bg='#2ecc71', fg='white', 
                 font=('Arial', 12, 'bold'),
                 padx=30, pady=10, cursor='hand2').pack(side=tk.RIGHT, padx=5)
        
        # Options
        opt_frame = tk.LabelFrame(tab, text="Opcje łączenia", 
                                 bg='#f0f0f0', padx=10, pady=10)
        opt_frame.pack(fill=tk.X, padx=10, pady=5)
        
        self.merge_sheets = tk.BooleanVar(value=True)
        tk.Checkbutton(opt_frame, text="Połącz wszystkie arkusze", 
                      variable=self.merge_sheets, bg='#f0f0f0',
                      font=('Arial', 10)).pack(anchor='w')
        
        self.add_source_column = tk.BooleanVar(value=True)
        tk.Checkbutton(opt_frame, text="Dodaj kolumnę z nazwą źródła", 
                      variable=self.add_source_column, bg='#f0f0f0',
                      font=('Arial', 10)).pack(anchor='w')
    
    def create_filter_tab(self):
        """Tab do filtrowania danych"""
        tab = tk.Frame(self.notebook, bg='#f0f0f0')
        self.notebook.add(tab, text="  Filtrowanie  ")
        
        desc = tk.Label(tab, text="Filtruj i sortuj dane w pliku Excel", 
                       font=('Arial', 12, 'bold'), bg='#f0f0f0')
        desc.pack(pady=10)
        
        # File selection
        file_frame = tk.Frame(tab, bg='#f0f0f0')
        file_frame.pack(fill=tk.X, padx=10, pady=10)
        
        tk.Label(file_frame, text="Plik do filtrowania:", 
                bg='#f0f0f0', font=('Arial', 10)).pack(side=tk.LEFT, padx=5)
        
        self.filter_file_label = tk.Label(file_frame, text="Nie wybrano pliku", 
                                          bg='white', relief=tk.SUNKEN,
                                          width=40, anchor='w', padx=10)
        self.filter_file_label.pack(side=tk.LEFT, padx=5)
        
        tk.Button(file_frame, text="📂 Wybierz Plik", 
                 command=self.select_filter_file,
                 bg='#3498db', fg='white', 
                 font=('Arial', 10, 'bold'),
                 padx=15, pady=5, cursor='hand2').pack(side=tk.LEFT, padx=5)
        
        # Filter options
        filter_frame = tk.LabelFrame(tab, text="Opcje filtrowania", 
                                    bg='#f0f0f0', padx=10, pady=10)
        filter_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Column selection
        tk.Label(filter_frame, text="Kolumna do filtrowania:", 
                bg='#f0f0f0', font=('Arial', 10)).grid(row=0, column=0, sticky='w', pady=5)
        
        self.filter_column = ttk.Combobox(filter_frame, width=30, 
                                         font=('Arial', 10), state='readonly')
        self.filter_column.grid(row=0, column=1, padx=10, pady=5)
        
        # Filter condition
        tk.Label(filter_frame, text="Warunek:", 
                bg='#f0f0f0', font=('Arial', 10)).grid(row=1, column=0, sticky='w', pady=5)
        
        self.filter_condition = ttk.Combobox(filter_frame, width=30, 
                                            font=('Arial', 10), state='readonly',
                                            values=['Zawiera', 'Równa się', 'Większe niż', 
                                                   'Mniejsze niż', 'Nie zawiera'])
        self.filter_condition.current(0)
        self.filter_condition.grid(row=1, column=1, padx=10, pady=5)
        
        # Filter value
        tk.Label(filter_frame, text="Wartość:", 
                bg='#f0f0f0', font=('Arial', 10)).grid(row=2, column=0, sticky='w', pady=5)
        
        self.filter_value = tk.Entry(filter_frame, width=32, font=('Arial', 10))
        self.filter_value.grid(row=2, column=1, padx=10, pady=5)
        
        # Sort option
        tk.Label(filter_frame, text="Sortuj po:", 
                bg='#f0f0f0', font=('Arial', 10)).grid(row=3, column=0, sticky='w', pady=5)
        
        sort_frame = tk.Frame(filter_frame, bg='#f0f0f0')
        sort_frame.grid(row=3, column=1, sticky='w', padx=10, pady=5)
        
        self.sort_column = ttk.Combobox(sort_frame, width=20, 
                                       font=('Arial', 10), state='readonly')
        self.sort_column.pack(side=tk.LEFT)
        
        self.sort_order = ttk.Combobox(sort_frame, width=8, 
                                      font=('Arial', 10), state='readonly',
                                      values=['Rosnąco', 'Malejąco'])
        self.sort_order.current(0)
        self.sort_order.pack(side=tk.LEFT, padx=5)
        
        # Apply button
        tk.Button(filter_frame, text="✅ Zastosuj Filtry i Eksportuj", 
                 command=self.apply_filters,
                 bg='#2ecc71', fg='white', 
                 font=('Arial', 12, 'bold'),
                 padx=30, pady=10, cursor='hand2').grid(row=4, column=0, columnspan=2, pady=20)
    
    def create_analyze_tab(self):
        """Tab do analizy danych"""
        tab = tk.Frame(self.notebook, bg='#f0f0f0')
        self.notebook.add(tab, text="  Analiza  ")
        
        desc = tk.Label(tab, text="Generuj raporty i statystyki", 
                       font=('Arial', 12, 'bold'), bg='#f0f0f0')
        desc.pack(pady=10)
        
        # File selection
        file_frame = tk.Frame(tab, bg='#f0f0f0')
        file_frame.pack(fill=tk.X, padx=10, pady=10)
        
        tk.Label(file_frame, text="Plik do analizy:", 
                bg='#f0f0f0', font=('Arial', 10)).pack(side=tk.LEFT, padx=5)
        
        self.analyze_file_label = tk.Label(file_frame, text="Nie wybrano pliku", 
                                           bg='white', relief=tk.SUNKEN,
                                           width=40, anchor='w', padx=10)
        self.analyze_file_label.pack(side=tk.LEFT, padx=5)
        
        tk.Button(file_frame, text="📂 Wybierz Plik", 
                 command=self.select_analyze_file,
                 bg='#3498db', fg='white', 
                 font=('Arial', 10, 'bold'),
                 padx=15, pady=5, cursor='hand2').pack(side=tk.LEFT, padx=5)
        
        # Analysis options
        analysis_frame = tk.LabelFrame(tab, text="Rodzaj analizy", 
                                      bg='#f0f0f0', padx=20, pady=20)
        analysis_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        analyses = [
            ("📊 Podstawowe statystyki (suma, średnia, min, max)", "basic"),
            ("📈 Grupowanie i sumowanie po kolumnie", "group"),
            ("🔢 Liczba unikalnych wartości w kolumnach", "unique"),
            ("📉 Brakujące dane (puste komórki)", "missing"),
            ("💰 Raport finansowy (suma przychodów/kosztów)", "financial")
        ]
        
        self.analysis_type = tk.StringVar(value="basic")
        
        for text, value in analyses:
            tk.Radiobutton(analysis_frame, text=text, 
                          variable=self.analysis_type,
                          value=value, bg='#f0f0f0',
                          font=('Arial', 10)).pack(anchor='w', pady=5)
        
        # Generate button
        tk.Button(tab, text="🎯 Generuj Raport", 
                 command=self.generate_report,
                 bg='#9b59b6', fg='white', 
                 font=('Arial', 12, 'bold'),
                 padx=40, pady=12, cursor='hand2').pack(pady=20)
    
    def create_convert_tab(self):
        """Tab do konwersji formatów"""
        tab = tk.Frame(self.notebook, bg='#f0f0f0')
        self.notebook.add(tab, text="  Konwersja  ")
        
        desc = tk.Label(tab, text="Konwertuj między formatami Excel i CSV", 
                       font=('Arial', 12, 'bold'), bg='#f0f0f0')
        desc.pack(pady=10)
        
        # Conversion options
        conv_frame = tk.LabelFrame(tab, text="Opcje konwersji", 
                                  bg='#f0f0f0', padx=40, pady=40)
        conv_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Excel to CSV
        excel_frame = tk.Frame(conv_frame, bg='#f0f0f0')
        excel_frame.pack(pady=20, fill=tk.X)
        
        tk.Label(excel_frame, text="📊 Excel → CSV", 
                font=('Arial', 14, 'bold'), bg='#f0f0f0',
                fg='#2c3e50').pack(pady=10)
        
        tk.Button(excel_frame, text="Konwertuj Excel do CSV", 
                 command=self.excel_to_csv,
                 bg='#3498db', fg='white', 
                 font=('Arial', 11, 'bold'),
                 padx=30, pady=10, cursor='hand2').pack()
        
        # Separator
        ttk.Separator(conv_frame, orient='horizontal').pack(fill=tk.X, pady=20)
        
        # CSV to Excel
        csv_frame = tk.Frame(conv_frame, bg='#f0f0f0')
        csv_frame.pack(pady=20, fill=tk.X)
        
        tk.Label(csv_frame, text="📄 CSV → Excel", 
                font=('Arial', 14, 'bold'), bg='#f0f0f0',
                fg='#2c3e50').pack(pady=10)
        
        tk.Button(csv_frame, text="Konwertuj CSV do Excel", 
                 command=self.csv_to_excel,
                 bg='#2ecc71', fg='white', 
                 font=('Arial', 11, 'bold'),
                 padx=30, pady=10, cursor='hand2').pack()
        
        # Separator
        ttk.Separator(conv_frame, orient='horizontal').pack(fill=tk.X, pady=20)
        
        # Multiple CSVs to Excel
        multi_frame = tk.Frame(conv_frame, bg='#f0f0f0')
        multi_frame.pack(pady=20, fill=tk.X)
        
        tk.Label(multi_frame, text="📚 Wiele CSV → Excel (osobne arkusze)", 
                font=('Arial', 14, 'bold'), bg='#f0f0f0',
                fg='#2c3e50').pack(pady=10)
        
        tk.Button(multi_frame, text="Konwertuj Wiele CSV do Excel", 
                 command=self.multiple_csv_to_excel,
                 bg='#e67e22', fg='white', 
                 font=('Arial', 11, 'bold'),
                 padx=30, pady=10, cursor='hand2').pack()
    
    # ========== MERGE FUNCTIONS ==========
    
    def add_files_to_merge(self):
        files = filedialog.askopenfilenames(
            title="Wybierz pliki Excel",
            filetypes=[("Excel files", "*.xlsx *.xls"), ("All files", "*.*")]
        )
        for file in files:
            if file not in self.files:
                self.files.append(file)
                self.merge_listbox.insert(tk.END, os.path.basename(file))
    
    def remove_file_from_merge(self):
        selection = self.merge_listbox.curselection()
        if selection:
            index = selection[0]
            self.merge_listbox.delete(index)
            self.files.pop(index)
    
    def merge_files(self):
        if not self.files:
            messagebox.showwarning("Uwaga", "Dodaj pliki do połączenia!")
            return
        
        try:
            all_data = []
            
            for file in self.files:
                if self.merge_sheets.get():
                    # Read all sheets
                    xls = pd.ExcelFile(file)
                    for sheet in xls.sheet_names:
                        df = pd.read_excel(file, sheet_name=sheet)
                        if self.add_source_column.get():
                            df['Źródło'] = f"{os.path.basename(file)} - {sheet}"
                        all_data.append(df)
                else:
                    # Read only first sheet
                    df = pd.read_excel(file)
                    if self.add_source_column.get():
                        df['Źródło'] = os.path.basename(file)
                    all_data.append(df)
            
            # Combine all dataframes
            combined = pd.concat(all_data, ignore_index=True)
            
            # Save
            output_file = filedialog.asksaveasfilename(
                defaultextension=".xlsx",
                filetypes=[("Excel files", "*.xlsx"), ("All files", "*.*")],
                initialfile=f"merged_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
            )
            
            if output_file:
                combined.to_excel(output_file, index=False)
                messagebox.showinfo("Sukces", 
                    f"Połączono {len(self.files)} plików!\n\n" +
                    f"Łącznie rekordów: {len(combined)}\n" +
                    f"Zapisano: {output_file}")
        
        except Exception as e:
            messagebox.showerror("Błąd", f"Nie udało się połączyć plików:\n{str(e)}")
    
    # ========== FILTER FUNCTIONS ==========
    
    def select_filter_file(self):
        file = filedialog.askopenfilename(
            title="Wybierz plik Excel",
            filetypes=[("Excel files", "*.xlsx *.xls"), ("CSV files", "*.csv"), ("All files", "*.*")]
        )
        if file:
            self.filter_file = file
            self.filter_file_label.config(text=os.path.basename(file))
            
            # Load columns
            try:
                if file.endswith('.csv'):
                    df = pd.read_csv(file, nrows=0)
                else:
                    df = pd.read_excel(file, nrows=0)
                
                columns = list(df.columns)
                self.filter_column['values'] = columns
                self.sort_column['values'] = [''] + columns
                
                if columns:
                    self.filter_column.current(0)
                    self.sort_column.current(0)
            except Exception as e:
                messagebox.showerror("Błąd", f"Nie udało się wczytać pliku:\n{str(e)}")
    
    def apply_filters(self):
        if not hasattr(self, 'filter_file'):
            messagebox.showwarning("Uwaga", "Wybierz plik do filtrowania!")
            return
        
        try:
            # Load data
            if self.filter_file.endswith('.csv'):
                df = pd.read_csv(self.filter_file)
            else:
                df = pd.read_excel(self.filter_file)
            
            original_count = len(df)
            
            # Apply filter
            if self.filter_column.get() and self.filter_value.get():
                column = self.filter_column.get()
                condition = self.filter_condition.get()
                value = self.filter_value.get()
                
                if condition == 'Zawiera':
                    df = df[df[column].astype(str).str.contains(value, case=False, na=False)]
                elif condition == 'Równa się':
                    df = df[df[column].astype(str) == value]
                elif condition == 'Większe niż':
                    df = df[pd.to_numeric(df[column], errors='coerce') > float(value)]
                elif condition == 'Mniejsze niż':
                    df = df[pd.to_numeric(df[column], errors='coerce') < float(value)]
                elif condition == 'Nie zawiera':
                    df = df[~df[column].astype(str).str.contains(value, case=False, na=False)]
            
            # Apply sort
            if self.sort_column.get():
                ascending = self.sort_order.get() == 'Rosnąco'
                df = df.sort_values(by=self.sort_column.get(), ascending=ascending)
            
            # Save
            output_file = filedialog.asksaveasfilename(
                defaultextension=".xlsx",
                filetypes=[("Excel files", "*.xlsx"), ("CSV files", "*.csv"), ("All files", "*.*")],
                initialfile=f"filtered_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
            )
            
            if output_file:
                if output_file.endswith('.csv'):
                    df.to_csv(output_file, index=False)
                else:
                    df.to_excel(output_file, index=False)
                
                messagebox.showinfo("Sukces", 
                    f"Przefiltrowano dane!\n\n" +
                    f"Oryginalna liczba rekordów: {original_count}\n" +
                    f"Po filtrach: {len(df)}\n" +
                    f"Zapisano: {output_file}")
        
        except Exception as e:
            messagebox.showerror("Błąd", f"Nie udało się przefiltrować danych:\n{str(e)}")
    
    # ========== ANALYZE FUNCTIONS ==========
    
    def select_analyze_file(self):
        file = filedialog.askopenfilename(
            title="Wybierz plik Excel",
            filetypes=[("Excel files", "*.xlsx *.xls"), ("CSV files", "*.csv"), ("All files", "*.*")]
        )
        if file:
            self.analyze_file = file
            self.analyze_file_label.config(text=os.path.basename(file))
    
    def generate_report(self):
        if not hasattr(self, 'analyze_file'):
            messagebox.showwarning("Uwaga", "Wybierz plik do analizy!")
            return
        
        try:
            # Load data
            if self.analyze_file.endswith('.csv'):
                df = pd.read_excel(self.analyze_file)
            else:
                df = pd.read_excel(self.analyze_file)
            
            analysis_type = self.analysis_type.get()
            
            if analysis_type == 'basic':
                report = df.describe(include='all').transpose()
            elif analysis_type == 'unique':
                report = pd.DataFrame({
                    'Kolumna': df.columns,
                    'Liczba unikalnych': [df[col].nunique() for col in df.columns],
                    'Przykładowe wartości': [', '.join(map(str, df[col].unique()[:5])) for col in df.columns]
                })
            elif analysis_type == 'missing':
                report = pd.DataFrame({
                    'Kolumna': df.columns,
                    'Brakujące': df.isnull().sum(),
                    'Procent': (df.isnull().sum() / len(df) * 100).round(2)
                })
            else:
                report = df.describe(include='all').transpose()
            
            # Save report
            output_file = filedialog.asksaveasfilename(
                defaultextension=".xlsx",
                filetypes=[("Excel files", "*.xlsx"), ("All files", "*.*")],
                initialfile=f"report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
            )
            
            if output_file:
                with pd.ExcelWriter(output_file, engine='openpyxl') as writer:
                    report.to_excel(writer, sheet_name='Raport')
                    df.head(100).to_excel(writer, sheet_name='Podgląd danych', index=False)
                
                messagebox.showinfo("Sukces", f"Raport wygenerowany!\n\nZapisano: {output_file}")
        
        except Exception as e:
            messagebox.showerror("Błąd", f"Nie udało się wygenerować raportu:\n{str(e)}")
    
    # ========== CONVERT FUNCTIONS ==========
    
    def excel_to_csv(self):
        file = filedialog.askopenfilename(
            title="Wybierz plik Excel",
            filetypes=[("Excel files", "*.xlsx *.xls"), ("All files", "*.*")]
        )
        if not file:
            return
        
        try:
            df = pd.read_excel(file)
            output_file = filedialog.asksaveasfilename(
                defaultextension=".csv",
                filetypes=[("CSV files", "*.csv"), ("All files", "*.*")],
                initialfile=f"{os.path.splitext(os.path.basename(file))[0]}.csv"
            )
            
            if output_file:
                df.to_csv(output_file, index=False, encoding='utf-8-sig')
                messagebox.showinfo("Sukces", f"Konwersja zakończona!\n\nZapisano: {output_file}")
        
        except Exception as e:
            messagebox.showerror("Błąd", f"Nie udało się skonwertować:\n{str(e)}")
    
    def csv_to_excel(self):
        file = filedialog.askopenfilename(
            title="Wybierz plik CSV",
            filetypes=[("CSV files", "*.csv"), ("All files", "*.*")]
        )
        if not file:
            return
        
        try:
            df = pd.read_csv(file)
            output_file = filedialog.asksaveasfilename(
                defaultextension=".xlsx",
                filetypes=[("Excel files", "*.xlsx"), ("All files", "*.*")],
                initialfile=f"{os.path.splitext(os.path.basename(file))[0]}.xlsx"
            )
            
            if output_file:
                df.to_excel(output_file, index=False)
                messagebox.showinfo("Sukces", f"Konwersja zakończona!\n\nZapisano: {output_file}")
        
        except Exception as e:
            messagebox.showerror("Błąd", f"Nie udało się skonwertować:\n{str(e)}")
    
    def multiple_csv_to_excel(self):
        files = filedialog.askopenfilenames(
            title="Wybierz pliki CSV",
            filetypes=[("CSV files", "*.csv"), ("All files", "*.*")]
        )
        if not files:
            return
        
        try:
            output_file = filedialog.asksaveasfilename(
                defaultextension=".xlsx",
                filetypes=[("Excel files", "*.xlsx"), ("All files", "*.*")],
                initialfile=f"combined_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
            )
            
            if output_file:
                with pd.ExcelWriter(output_file, engine='openpyxl') as writer:
                    for file in files:
                        df = pd.read_csv(file)
                        sheet_name = os.path.splitext(os.path.basename(file))[0][:31]  # Excel limit
                        df.to_excel(writer, sheet_name=sheet_name, index=False)
                
                messagebox.showinfo("Sukces", 
                    f"Konwersja zakończona!\n\n" +
                    f"Połączono {len(files)} plików CSV\n" +
                    f"Zapisano: {output_file}")
        
        except Exception as e:
            messagebox.showerror("Błąd", f"Nie udało się skonwertować:\n{str(e)}")


def main():
    root = tk.Tk()
    app = ExcelAutomationApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
