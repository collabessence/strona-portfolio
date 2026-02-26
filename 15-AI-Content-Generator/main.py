#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AI Content Generator - Lokalny generator tekstu z Hugging Face
Autor: Portfolio Project
Wersja: 1.0.0
"""

import tkinter as tk
from tkinter import ttk, scrolledtext, messagebox, filedialog
import threading
import json
import os
from datetime import datetime
from pathlib import Path

# Importy AI (będą instalowane przez pip)
try:
    from transformers import GPT2LMHeadModel, GPT2Tokenizer, pipeline
    import torch
    AI_AVAILABLE = True
except ImportError:
    AI_AVAILABLE = False

class AIContentGenerator:
    def __init__(self, root):
        self.root = root
        self.root.title("AI Content Generator - Lokalny model bez API")
        self.root.geometry("1200x800")
        self.root.configure(bg='#1a1a2e')
        
        # Zmienne
        self.model = None
        self.tokenizer = None
        self.generator = None
        self.is_model_loaded = False
        self.history = []
        self.history_file = Path("generation_history.json")
        
        # Ładowanie historii
        self.load_history()
        
        # Style
        self.setup_styles()
        
        # UI
        self.create_header()
        self.create_main_content()
        self.create_footer()
        
        # Sprawdzenie czy AI dostępne
        if not AI_AVAILABLE:
            self.show_installation_guide()
        else:
            self.status_label.config(text="✅ Biblioteki AI zainstalowane. Kliknij 'Załaduj Model' aby rozpocząć.")
    
    def setup_styles(self):
        """Konfiguracja stylów"""
        style = ttk.Style()
        style.theme_use('clam')
        
        # Kolory
        bg_dark = '#1a1a2e'
        bg_medium = '#16213e'
        bg_light = '#0f3460'
        accent = '#e94560'
        text_color = '#ffffff'
        
        style.configure('Title.TLabel', 
                       background=bg_dark, 
                       foreground=text_color,
                       font=('Segoe UI', 24, 'bold'))
        
        style.configure('Subtitle.TLabel',
                       background=bg_dark,
                       foreground='#a8a8a8',
                       font=('Segoe UI', 10))
        
        style.configure('Section.TLabel',
                       background=bg_medium,
                       foreground=text_color,
                       font=('Segoe UI', 12, 'bold'))
        
        style.configure('Info.TLabel',
                       background=bg_medium,
                       foreground='#a8a8a8',
                       font=('Segoe UI', 9))
        
        style.configure('Custom.TButton',
                       background=accent,
                       foreground=text_color,
                       font=('Segoe UI', 10, 'bold'),
                       borderwidth=0,
                       focuscolor='none')
        
        style.map('Custom.TButton',
                 background=[('active', '#d63447')])
        
        style.configure('TNotebook', background=bg_dark, borderwidth=0)
        style.configure('TNotebook.Tab', 
                       background=bg_medium,
                       foreground=text_color,
                       padding=[20, 10])
        style.map('TNotebook.Tab',
                 background=[('selected', bg_light)],
                 foreground=[('selected', accent)])
    
    def create_header(self):
        """Nagłówek aplikacji"""
        header_frame = tk.Frame(self.root, bg='#1a1a2e', pady=20)
        header_frame.pack(fill='x')
        
        title_label = ttk.Label(header_frame, 
                               text="🤖 AI Content Generator",
                               style='Title.TLabel')
        title_label.pack()
        
        subtitle_label = ttk.Label(header_frame,
                                   text="Lokalny generator tekstu • Bez API • Hugging Face Transformers",
                                   style='Subtitle.TLabel')
        subtitle_label.pack()
        
        # Status bar
        status_frame = tk.Frame(self.root, bg='#16213e', pady=10)
        status_frame.pack(fill='x')
        
        self.status_label = ttk.Label(status_frame,
                                     text="⏳ Sprawdzanie dostępności modelu AI...",
                                     style='Info.TLabel')
        self.status_label.pack()
    
    def create_main_content(self):
        """Główna zawartość - notebook z zakładkami"""
        main_frame = tk.Frame(self.root, bg='#1a1a2e')
        main_frame.pack(fill='both', expand=True, padx=20, pady=10)
        
        # Notebook
        self.notebook = ttk.Notebook(main_frame)
        self.notebook.pack(fill='both', expand=True)
        
        # Zakładki
        self.create_generator_tab()
        self.create_templates_tab()
        self.create_history_tab()
        self.create_settings_tab()
    
    def create_generator_tab(self):
        """Zakładka generatora"""
        tab = tk.Frame(self.notebook, bg='#16213e')
        self.notebook.add(tab, text='📝 Generator')
        
        # Lewy panel - Parametry
        left_panel = tk.Frame(tab, bg='#16213e', width=400)
        left_panel.pack(side='left', fill='both', padx=10, pady=10)
        
        # Kategoria
        ttk.Label(left_panel, text="Typ treści:", style='Section.TLabel').pack(anchor='w', pady=(0, 5))
        self.content_type = ttk.Combobox(left_panel, 
                                         values=['Post na Facebooka', 
                                                'Post na LinkedIn',
                                                'Post na Instagram',
                                                'Opis produktu',
                                                'Artykuł blogowy',
                                                'Email marketingowy',
                                                'Meta description SEO',
                                                'Własny prompt'],
                                         state='readonly',
                                         font=('Segoe UI', 10))
        self.content_type.set('Post na Facebooka')
        self.content_type.pack(fill='x', pady=(0, 15))
        
        # Temat
        ttk.Label(left_panel, text="Temat / Słowa kluczowe:", style='Section.TLabel').pack(anchor='w', pady=(0, 5))
        self.topic_entry = tk.Text(left_panel, height=3, font=('Segoe UI', 10),
                                   bg='#0f3460', fg='white', insertbackground='white',
                                   relief='flat', padx=10, pady=10)
        self.topic_entry.pack(fill='x', pady=(0, 15))
        self.topic_entry.insert('1.0', 'Nowa kolekcja jesiennych ubrań')
        
        # Ton
        ttk.Label(left_panel, text="Ton wypowiedzi:", style='Section.TLabel').pack(anchor='w', pady=(0, 5))
        self.tone_var = tk.StringVar(value='profesjonalny')
        tones = [
            ('Profesjonalny', 'profesjonalny'),
            ('Przyjazny', 'przyjazny'),
            ('Entuzjastyczny', 'entuzjastyczny'),
            ('Formalny', 'formalny'),
            ('Humorystyczny', 'humorystyczny')
        ]
        for text, value in tones:
            rb = tk.Radiobutton(left_panel, text=text, variable=self.tone_var,
                               value=value, bg='#16213e', fg='white',
                               selectcolor='#0f3460', font=('Segoe UI', 9),
                               activebackground='#16213e', activeforeground='white')
            rb.pack(anchor='w')
        
        # Długość
        ttk.Label(left_panel, text=f"Długość tekstu:", style='Section.TLabel').pack(anchor='w', pady=(15, 5))
        self.length_var = tk.IntVar(value=100)
        self.length_slider = tk.Scale(left_panel, from_=50, to=500,
                                      orient='horizontal', variable=self.length_var,
                                      bg='#16213e', fg='white', troughcolor='#0f3460',
                                      highlightthickness=0, font=('Segoe UI', 9))
        self.length_slider.pack(fill='x', pady=(0, 5))
        self.length_label = ttk.Label(left_panel, text="100 słów", style='Info.TLabel')
        self.length_label.pack(anchor='w')
        self.length_slider.config(command=lambda v: self.length_label.config(text=f"{int(float(v))} słów"))
        
        # Temperatura (kreatywność)
        ttk.Label(left_panel, text="Kreatywność:", style='Section.TLabel').pack(anchor='w', pady=(15, 5))
        self.temp_var = tk.DoubleVar(value=0.7)
        self.temp_slider = tk.Scale(left_panel, from_=0.1, to=1.5, resolution=0.1,
                                    orient='horizontal', variable=self.temp_var,
                                    bg='#16213e', fg='white', troughcolor='#0f3460',
                                    highlightthickness=0, font=('Segoe UI', 9))
        self.temp_slider.pack(fill='x', pady=(0, 5))
        temp_info = ttk.Label(left_panel, 
                             text="Niska = bardziej przewidywalne\nWysoka = bardziej kreatywne",
                             style='Info.TLabel')
        temp_info.pack(anchor='w')
        
        # Przyciski akcji
        buttons_frame = tk.Frame(left_panel, bg='#16213e')
        buttons_frame.pack(fill='x', pady=20)
        
        self.load_btn = tk.Button(buttons_frame, text="⚡ Załaduj Model",
                                  command=self.load_model,
                                  bg='#e94560', fg='white',
                                  font=('Segoe UI', 11, 'bold'),
                                  relief='flat', cursor='hand2',
                                  padx=20, pady=10)
        self.load_btn.pack(fill='x', pady=(0, 10))
        
        self.generate_btn = tk.Button(buttons_frame, text="🚀 Generuj Tekst",
                                      command=self.generate_content,
                                      bg='#4CAF50', fg='white',
                                      font=('Segoe UI', 11, 'bold'),
                                      relief='flat', cursor='hand2',
                                      padx=20, pady=10,
                                      state='disabled')
        self.generate_btn.pack(fill='x')
        
        # Prawy panel - Wynik
        right_panel = tk.Frame(tab, bg='#16213e')
        right_panel.pack(side='right', fill='both', expand=True, padx=10, pady=10)
        
        ttk.Label(right_panel, text="📄 Wygenerowany tekst:", style='Section.TLabel').pack(anchor='w', pady=(0, 10))
        
        self.output_text = scrolledtext.ScrolledText(right_panel,
                                                      font=('Segoe UI', 11),
                                                      bg='#0f3460', fg='white',
                                                      insertbackground='white',
                                                      relief='flat', padx=15, pady=15,
                                                      wrap='word')
        self.output_text.pack(fill='both', expand=True, pady=(0, 10))
        
        # Przyciski pod wynikiem
        output_buttons = tk.Frame(right_panel, bg='#16213e')
        output_buttons.pack(fill='x')
        
        tk.Button(output_buttons, text="📋 Kopiuj",
                 command=self.copy_to_clipboard,
                 bg='#2196F3', fg='white',
                 font=('Segoe UI', 10),
                 relief='flat', cursor='hand2',
                 padx=15, pady=8).pack(side='left', padx=(0, 5))
        
        tk.Button(output_buttons, text="💾 Zapisz do pliku",
                 command=self.save_to_file,
                 bg='#FF9800', fg='white',
                 font=('Segoe UI', 10),
                 relief='flat', cursor='hand2',
                 padx=15, pady=8).pack(side='left', padx=5)
        
        tk.Button(output_buttons, text="🔄 Wyczyść",
                 command=lambda: self.output_text.delete('1.0', 'end'),
                 bg='#f44336', fg='white',
                 font=('Segoe UI', 10),
                 relief='flat', cursor='hand2',
                 padx=15, pady=8).pack(side='left', padx=5)
    
    def create_templates_tab(self):
        """Zakładka z szablonami"""
        tab = tk.Frame(self.notebook, bg='#16213e')
        self.notebook.add(tab, text='📋 Szablony')
        
        ttk.Label(tab, text="Gotowe szablony promptów", 
                 style='Section.TLabel').pack(pady=20)
        
        templates = [
            ("🛍️ Promocja produktu", "Napisz przekonujący post promujący {product}. Podkreśl korzyści i dodaj call-to-action."),
            ("📰 Artykuł ekspercki", "Napisz profesjonalny artykuł na temat: {topic}. Uwzględnij wprowadzenie, 3 główne punkty i podsumowanie."),
            ("✉️ Email powitalny", "Stwórz ciepły email powitalny dla nowych subskrybentów {business}. Przedstaw wartości i zachęć do akcji."),
            ("🎯 Meta description", "Napisz zachęcający meta description (max 155 znaków) dla strony o: {topic}"),
            ("💼 Post LinkedIn", "Stwórz profesjonalny post na LinkedIn o {topic}. Dodaj wartość, insights i pytanie angażujące."),
            ("📸 Caption Instagram", "Napisz kreatywny caption na Instagram dla {product/event}. Dodaj emoji i hashtagi."),
        ]
        
        for title, template in templates:
            frame = tk.Frame(tab, bg='#0f3460', relief='flat')
            frame.pack(fill='x', padx=20, pady=5)
            
            tk.Label(frame, text=title, bg='#0f3460', fg='white',
                    font=('Segoe UI', 11, 'bold')).pack(anchor='w', padx=15, pady=(10, 5))
            
            tk.Label(frame, text=template, bg='#0f3460', fg='#a8a8a8',
                    font=('Segoe UI', 9), wraplength=700, justify='left').pack(anchor='w', padx=15, pady=(0, 10))
    
    def create_history_tab(self):
        """Zakładka z historią"""
        tab = tk.Frame(self.notebook, bg='#16213e')
        self.notebook.add(tab, text='📜 Historia')
        
        ttk.Label(tab, text="Historia generacji", style='Section.TLabel').pack(pady=20)
        
        self.history_list = tk.Listbox(tab, bg='#0f3460', fg='white',
                                       font=('Segoe UI', 10),
                                       selectmode='single',
                                       relief='flat')
        self.history_list.pack(fill='both', expand=True, padx=20, pady=(0, 10))
        
        self.update_history_list()
        
        tk.Button(tab, text="🗑️ Wyczyść historię",
                 command=self.clear_history,
                 bg='#f44336', fg='white',
                 font=('Segoe UI', 10),
                 relief='flat', cursor='hand2',
                 padx=20, pady=10).pack(pady=10)
    
    def create_settings_tab(self):
        """Zakładka ustawień"""
        tab = tk.Frame(self.notebook, bg='#16213e')
        self.notebook.add(tab, text='⚙️ Ustawienia')
        
        ttk.Label(tab, text="Konfiguracja modelu AI", style='Section.TLabel').pack(pady=20)
        
        info_text = """
        Model: GPT-2 / DistilGPT2 (Hugging Face)
        
        Ten generator używa lokalnego modelu AI, który działa bez internetu
        po pierwszym pobraniu. Model jest przechowywany lokalnie na dysku.
        
        Pierwsze uruchomienie wymaga połączenia z internetem do pobrania
        modelu (około 500MB). Kolejne uruchomienia działają offline.
        
        Wymagania:
        - Python 3.8+
        - transformers
        - torch
        - około 2GB wolnego miejsca na dysku
        
        Wydajność zależy od sprzętu:
        - CPU: 5-30 sekund na generację
        - GPU: 1-5 sekund na generację
        """
        
        tk.Label(tab, text=info_text, bg='#16213e', fg='#a8a8a8',
                font=('Segoe UI', 10), justify='left').pack(padx=30, pady=20)
    
    def create_footer(self):
        """Stopka"""
        footer = tk.Frame(self.root, bg='#0f3460', pady=10)
        footer.pack(fill='x', side='bottom')
        
        tk.Label(footer, text="AI Content Generator v1.0 | Portfolio Project | 2025",
                bg='#0f3460', fg='#666',
                font=('Segoe UI', 9)).pack()
    
    def load_model(self):
        """Ładowanie modelu AI"""
        if not AI_AVAILABLE:
            messagebox.showerror("Błąd", 
                               "Brak wymaganych bibliotek!\n\n"
                               "Zainstaluj: pip install transformers torch")
            return
        
        self.load_btn.config(state='disabled', text="⏳ Ładowanie modelu...")
        self.status_label.config(text="⏳ Pobieranie i ładowanie modelu AI... (może potrwać 1-2 min przy pierwszym razie)")
        
        def load_thread():
            try:
                # Używamy lekszego modelu distilgpt2
                model_name = "distilgpt2"
                
                self.tokenizer = GPT2Tokenizer.from_pretrained(model_name)
                self.model = GPT2LMHeadModel.from_pretrained(model_name)
                self.generator = pipeline('text-generation', 
                                         model=self.model, 
                                         tokenizer=self.tokenizer)
                
                self.is_model_loaded = True
                
                self.root.after(0, lambda: self.load_btn.config(text="✅ Model załadowany", state='disabled'))
                self.root.after(0, lambda: self.generate_btn.config(state='normal'))
                self.root.after(0, lambda: self.status_label.config(text="✅ Model AI gotowy do użycia!"))
                
            except Exception as e:
                self.root.after(0, lambda: messagebox.showerror("Błąd", f"Nie udało się załadować modelu:\n{str(e)}"))
                self.root.after(0, lambda: self.load_btn.config(state='normal', text="⚡ Załaduj Model"))
                self.root.after(0, lambda: self.status_label.config(text="❌ Błąd ładowania modelu"))
        
        threading.Thread(target=load_thread, daemon=True).start()
    
    def generate_content(self):
        """Generowanie treści"""
        if not self.is_model_loaded:
            messagebox.showwarning("Uwaga", "Najpierw załaduj model AI!")
            return
        
        topic = self.topic_entry.get('1.0', 'end').strip()
        if not topic:
            messagebox.showwarning("Uwaga", "Wpisz temat!")
            return
        
        self.generate_btn.config(state='disabled', text="⏳ Generowanie...")
        self.output_text.delete('1.0', 'end')
        self.output_text.insert('1.0', "Generowanie tekstu...\n")
        
        def generate_thread():
            try:
                content_type = self.content_type.get()
                tone = self.tone_var.get()
                max_length = self.length_var.get()
                temperature = self.temp_var.get()
                
                # Tworzenie promptu
                prompt = self.create_prompt(content_type, topic, tone)
                
                # Generowanie
                result = self.generator(prompt,
                                       max_length=max_length + len(prompt.split()),
                                       temperature=temperature,
                                       num_return_sequences=1,
                                       pad_token_id=self.tokenizer.eos_token_id)
                
                generated_text = result[0]['generated_text']
                # Usunięcie promptu z wyniku
                generated_text = generated_text[len(prompt):].strip()
                
                # Zapisz do historii
                self.add_to_history(content_type, topic, generated_text)
                
                self.root.after(0, lambda: self.output_text.delete('1.0', 'end'))
                self.root.after(0, lambda: self.output_text.insert('1.0', generated_text))
                self.root.after(0, lambda: self.generate_btn.config(state='normal', text="🚀 Generuj Tekst"))
                self.root.after(0, lambda: self.status_label.config(text=f"✅ Wygenerowano {len(generated_text.split())} słów"))
                
            except Exception as e:
                self.root.after(0, lambda: messagebox.showerror("Błąd", f"Błąd generowania:\n{str(e)}"))
                self.root.after(0, lambda: self.generate_btn.config(state='normal', text="🚀 Generuj Tekst"))
        
        threading.Thread(target=generate_thread, daemon=True).start()
    
    def create_prompt(self, content_type, topic, tone):
        """Tworzenie promptu na podstawie parametrów"""
        prompts = {
            'Post na Facebooka': f"Write an engaging Facebook post about {topic} in a {tone} tone: ",
            'Post na LinkedIn': f"Create a professional LinkedIn post about {topic} in a {tone} tone: ",
            'Post na Instagram': f"Write a creative Instagram caption about {topic} in a {tone} tone: ",
            'Opis produktu': f"Write a compelling product description for {topic} in a {tone} tone: ",
            'Artykuł blogowy': f"Write a blog article about {topic} in a {tone} tone: ",
            'Email marketingowy': f"Write a marketing email about {topic} in a {tone} tone: ",
            'Meta description SEO': f"Write an SEO meta description for {topic}: ",
            'Własny prompt': f"{topic} "
        }
        
        return prompts.get(content_type, f"{topic} ")
    
    def copy_to_clipboard(self):
        """Kopiowanie do schowka"""
        text = self.output_text.get('1.0', 'end').strip()
        if text:
            self.root.clipboard_clear()
            self.root.clipboard_append(text)
            self.status_label.config(text="📋 Skopiowano do schowka!")
    
    def save_to_file(self):
        """Zapisywanie do pliku"""
        text = self.output_text.get('1.0', 'end').strip()
        if not text:
            return
        
        filename = filedialog.asksaveasfilename(
            defaultextension=".txt",
            filetypes=[("Text files", "*.txt"), ("All files", "*.*")]
        )
        
        if filename:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(text)
            self.status_label.config(text=f"💾 Zapisano do: {os.path.basename(filename)}")
    
    def add_to_history(self, content_type, topic, result):
        """Dodawanie do historii"""
        entry = {
            'timestamp': datetime.now().isoformat(),
            'type': content_type,
            'topic': topic,
            'result': result[:200] + '...' if len(result) > 200 else result
        }
        self.history.append(entry)
        self.save_history()
        self.update_history_list()
    
    def load_history(self):
        """Wczytywanie historii z pliku"""
        if self.history_file.exists():
            try:
                with open(self.history_file, 'r', encoding='utf-8') as f:
                    self.history = json.load(f)
            except:
                self.history = []
    
    def save_history(self):
        """Zapisywanie historii do pliku"""
        with open(self.history_file, 'w', encoding='utf-8') as f:
            json.dump(self.history, f, ensure_ascii=False, indent=2)
    
    def update_history_list(self):
        """Aktualizacja listy historii"""
        self.history_list.delete(0, 'end')
        for entry in reversed(self.history[-50:]):  # Ostatnie 50
            time = datetime.fromisoformat(entry['timestamp']).strftime('%Y-%m-%d %H:%M')
            text = f"{time} | {entry['type']} | {entry['topic'][:30]}"
            self.history_list.insert('end', text)
    
    def clear_history(self):
        """Czyszczenie historii"""
        if messagebox.askyesno("Potwierdzenie", "Czy na pewno wyczyścić historię?"):
            self.history = []
            self.save_history()
            self.update_history_list()
    
    def show_installation_guide(self):
        """Pokaż instrukcję instalacji"""
        guide = """
        ⚠️ BRAK WYMAGANYCH BIBLIOTEK
        
        Aby używać AI Content Generator, zainstaluj wymagane pakiety:
        
        1. Otwórz terminal / command prompt
        2. Uruchom komendy:
        
           pip install transformers
           pip install torch
        
        3. Uruchom ponownie aplikację
        
        Pierwsze uruchomienie pobierze model AI (~500MB).
        """
        
        messagebox.showinfo("Instalacja wymagana", guide)


def main():
    root = tk.Tk()
    app = AIContentGenerator(root)
    root.mainloop()


if __name__ == "__main__":
    main()
