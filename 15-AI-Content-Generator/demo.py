#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AI Content Generator - DEMO MODE
Wersja demonstracyjna bez wymagania instalacji Transformers
Używa wbudowanych szablonów zamiast prawdziwego AI
"""

import tkinter as tk
from tkinter import ttk, scrolledtext, messagebox, filedialog
import json
import random
from datetime import datetime
from pathlib import Path

class AIContentGeneratorDemo:
    def __init__(self, root):
        self.root = root
        self.root.title("AI Content Generator - DEMO MODE (bez AI)")
        self.root.geometry("1200x800")
        self.root.configure(bg='#1a1a2e')
        
        self.history = []
        self.history_file = Path("demo_history.json")
        self.load_history()
        
        self.setup_styles()
        self.create_ui()
    
    def setup_styles(self):
        """Konfiguracja stylów"""
        style = ttk.Style()
        style.theme_use('clam')
        
        style.configure('Title.TLabel', 
                       background='#1a1a2e', 
                       foreground='#ffffff',
                       font=('Segoe UI', 24, 'bold'))
        
        style.configure('Subtitle.TLabel',
                       background='#1a1a2e',
                       foreground='#a8a8a8',
                       font=('Segoe UI', 10))
        
        style.configure('Section.TLabel',
                       background='#16213e',
                       foreground='#ffffff',
                       font=('Segoe UI', 12, 'bold'))
    
    def create_ui(self):
        """Tworzenie interfejsu"""
        # Header
        header_frame = tk.Frame(self.root, bg='#1a1a2e', pady=20)
        header_frame.pack(fill='x')
        
        ttk.Label(header_frame, 
                 text="🤖 AI Content Generator - DEMO",
                 style='Title.TLabel').pack()
        
        ttk.Label(header_frame,
                 text="Tryb demonstracyjny • Szablon-based generator",
                 style='Subtitle.TLabel').pack()
        
        # Status
        status_frame = tk.Frame(self.root, bg='#16213e', pady=10)
        status_frame.pack(fill='x')
        
        self.status_label = tk.Label(status_frame,
                                     text="✅ Tryb DEMO - gotowy do użycia (brak wymagań instalacji)",
                                     bg='#16213e', fg='#10b981',
                                     font=('Segoe UI', 10))
        self.status_label.pack()
        
        # Main content
        main_frame = tk.Frame(self.root, bg='#16213e')
        main_frame.pack(fill='both', expand=True, padx=20, pady=20)
        
        # Left panel
        left_panel = tk.Frame(main_frame, bg='#16213e', width=400)
        left_panel.pack(side='left', fill='both', padx=10)
        
        ttk.Label(left_panel, text="Typ treści:", style='Section.TLabel').pack(anchor='w', pady=(0, 5))
        self.content_type = ttk.Combobox(left_panel, 
                                         values=['Post na Facebooka', 
                                                'Post na LinkedIn',
                                                'Post na Instagram',
                                                'Opis produktu',
                                                'Email marketingowy',
                                                'Meta description SEO'],
                                         state='readonly',
                                         font=('Segoe UI', 10))
        self.content_type.set('Post na Facebooka')
        self.content_type.pack(fill='x', pady=(0, 15))
        
        ttk.Label(left_panel, text="Temat / Produkt:", style='Section.TLabel').pack(anchor='w', pady=(0, 5))
        self.topic_entry = tk.Text(left_panel, height=4, font=('Segoe UI', 10),
                                   bg='#0f3460', fg='white', insertbackground='white',
                                   relief='flat', padx=10, pady=10)
        self.topic_entry.pack(fill='x', pady=(0, 15))
        self.topic_entry.insert('1.0', 'Nowa kolekcja jesiennych ubrań')
        
        ttk.Label(left_panel, text="Styl:", style='Section.TLabel').pack(anchor='w', pady=(0, 5))
        self.tone_var = tk.StringVar(value='profesjonalny')
        for tone in ['Profesjonalny', 'Przyjazny', 'Entuzjastyczny', 'Sprzedażowy']:
            tk.Radiobutton(left_panel, text=tone, variable=self.tone_var,
                          value=tone.lower(), bg='#16213e', fg='white',
                          selectcolor='#0f3460', font=('Segoe UI', 9),
                          activebackground='#16213e').pack(anchor='w')
        
        # Generate button
        tk.Button(left_panel, text="🚀 Generuj Tekst (DEMO)",
                 command=self.generate_demo,
                 bg='#4CAF50', fg='white',
                 font=('Segoe UI', 12, 'bold'),
                 relief='flat', cursor='hand2',
                 padx=20, pady=15).pack(fill='x', pady=20)
        
        # Right panel
        right_panel = tk.Frame(main_frame, bg='#16213e')
        right_panel.pack(side='right', fill='both', expand=True, padx=10)
        
        ttk.Label(right_panel, text="📄 Wygenerowany tekst:", style='Section.TLabel').pack(anchor='w', pady=(0, 10))
        
        self.output_text = scrolledtext.ScrolledText(right_panel,
                                                      font=('Segoe UI', 11),
                                                      bg='#0f3460', fg='white',
                                                      insertbackground='white',
                                                      relief='flat', padx=15, pady=15,
                                                      wrap='word')
        self.output_text.pack(fill='both', expand=True, pady=(0, 10))
        
        # Buttons
        btn_frame = tk.Frame(right_panel, bg='#16213e')
        btn_frame.pack(fill='x')
        
        tk.Button(btn_frame, text="📋 Kopiuj",
                 command=self.copy_to_clipboard,
                 bg='#2196F3', fg='white',
                 font=('Segoe UI', 10),
                 relief='flat', cursor='hand2',
                 padx=15, pady=8).pack(side='left', padx=(0, 5))
        
        tk.Button(btn_frame, text="💾 Zapisz",
                 command=self.save_to_file,
                 bg='#FF9800', fg='white',
                 font=('Segoe UI', 10),
                 relief='flat', cursor='hand2',
                 padx=15, pady=8).pack(side='left')
    
    def generate_demo(self):
        """Generowanie tekstu w trybie demo (szablony)"""
        topic = self.topic_entry.get('1.0', 'end').strip()
        if not topic:
            messagebox.showwarning("Uwaga", "Wpisz temat!")
            return
        
        content_type = self.content_type.get()
        tone = self.tone_var.get()
        
        # Szablony demonstracyjne
        templates = {
            'Post na Facebooka': [
                f"🎉 Mamy fantastyczne wiadomości! {topic} - już dostępne! To coś, na co czekaliście. Sprawdźcie już dziś! 💫 #nowość #promocja",
                f"📢 Uwaga, uwaga! {topic} właśnie trafiło do nas! Nie przegapcie okazji, aby być jednymi z pierwszych. Zapraszamy! ✨",
                f"Dziś jest ten dzień! 🌟 {topic} - świeżo, nowocześnie, dla Was! Kliknijcie link w bio i przekonajcie się sami! 🔥"
            ],
            'Post na LinkedIn': [
                f"Excited to share: {topic}. This represents significant progress in our field. Looking forward to hearing your thoughts and insights. #Innovation #Professional",
                f"Proud to announce {topic}. We've been working on this for months and the results speak for themselves. Let's connect and discuss! #Business #Growth",
                f"Today marks an important milestone: {topic}. Our team has put tremendous effort into this. What are your experiences? #Leadership #Strategy"
            ],
            'Post na Instagram': [
                f"✨ {topic} ✨\n\nNew drop alert! 📸 Swipe to see more\n.\n.\n.\n#instagood #photooftheday #beautiful #fashion #style",
                f"💫 NOWOŚĆ 💫\n\n{topic} już u nas!\n\nTag someone who needs to see this! 👇\n\n#newcollection #musthave #inspiration",
                f"🔥 {topic} 🔥\n\nDouble tap if you love it! ❤️\n\n#lifestyle #daily #trending #viral"
            ],
            'Opis produktu': [
                f"{topic}\n\nWysoka jakość wykonania połączona z nowoczesnym designem. Ten produkt został stworzony z myślą o najbardziej wymagających klientach.\n\nCechy:\n• Trwałość i niezawodność\n• Elegancki wygląd\n• Łatwy w użyciu\n• Gwarancja satysfakcji\n\nZamów już dziś!",
                f"Poznaj {topic} - produkt, który zmieni Twoje życie!\n\nDlaczego warto?\n✓ Najwyższa jakość materiałów\n✓ Przemyślany design\n✓ Doskonałe recenzje klientów\n✓ Konkurencyjna cena\n\nDołącz do tysięcy zadowolonych użytkowników!",
                f"{topic} - innowacja, na którą czekałeś.\n\nTo więcej niż produkt - to inwestycja w Twój komfort i styl. Wykonany z dbałością o każdy detal, zaprojektowany dla Ciebie.\n\nSpecyfikacja:\n→ Premium quality\n→ Modern design\n→ Eco-friendly\n\nKup teraz z dostawą gratis!"
            ],
            'Email marketingowy': [
                f"Temat: Ekskluzywna oferta: {topic}\n\nCześć!\n\nMamy dla Ciebie coś wyjątkowego. {topic} - dostępne tylko dla naszych subskrybentów przez ograniczony czas.\n\nCo zyskujesz?\n• Specjalną cenę\n• Darmową dostawę\n• Bonus przy zakupie\n\nNie czekaj - oferta kończy się wkrótce!\n\n[KLIKNIJ TUTAJ]\n\nPozdrawiam,\nZespół",
                f"Temat: Nie przegap! {topic}\n\nDzień dobry,\n\n{topic} - o czym wszyscy mówią. I możesz to mieć Ty!\n\nDlaczego teraz?\n→ Najlepsza cena roku\n→ Gwarancja satysfakcji\n→ Wsparcie 24/7\n\nOferta ważna tylko 48h!\n\n[ZAMÓW TERAZ]\n\nDo zobaczenia,\nTwój Team"
            ],
            'Meta description SEO': [
                f"{topic} ⭐ Najlepsza jakość ✓ Szybka dostawa ✓ Sprawdź ofertę i przekonaj się sam! Kliknij i zobacz więcej.",
                f"Odkryj {topic} w świetnych cenach. Szeroki wybór, profesjonalna obsługa. Zamów online już dziś!",
                f"{topic} - Twój wybór! Wysokiej jakości produkty/usługi. Zaufali nam już tysiące klientów. Zobacz ofertę »"
            ]
        }
        
        # Wybierz losowy szablon
        results = templates.get(content_type, templates['Post na Facebooka'])
        result = random.choice(results)
        
        # Modyfikacja w zależności od tonu
        if tone == 'entuzjastyczny':
            result = result.replace('.', '!').replace('Sprawdź', 'Koniecznie sprawdź')
        elif tone == 'sprzedażowy':
            result += "\n\n⚡ PROMOCJA! Kod: SAVE20 ⚡"
        
        # Wyświetl
        self.output_text.delete('1.0', 'end')
        self.output_text.insert('1.0', result)
        
        # Historia
        self.add_to_history(content_type, topic, result)
        
        self.status_label.config(text=f"✅ Wygenerowano {len(result.split())} słów | Tryb DEMO (szablony)")
    
    def copy_to_clipboard(self):
        """Kopiuj do schowka"""
        text = self.output_text.get('1.0', 'end').strip()
        if text:
            self.root.clipboard_clear()
            self.root.clipboard_append(text)
            self.status_label.config(text="📋 Skopiowano do schowka!")
    
    def save_to_file(self):
        """Zapisz do pliku"""
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
            self.status_label.config(text=f"💾 Zapisano!")
    
    def add_to_history(self, content_type, topic, result):
        """Dodaj do historii"""
        entry = {
            'timestamp': datetime.now().isoformat(),
            'type': content_type,
            'topic': topic,
            'result': result[:100]
        }
        self.history.append(entry)
        self.save_history()
    
    def load_history(self):
        """Wczytaj historię"""
        if self.history_file.exists():
            try:
                with open(self.history_file, 'r', encoding='utf-8') as f:
                    self.history = json.load(f)
            except:
                self.history = []
    
    def save_history(self):
        """Zapisz historię"""
        with open(self.history_file, 'w', encoding='utf-8') as f:
            json.dump(self.history[-100:], f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    root = tk.Tk()
    app = AIContentGeneratorDemo(root)
    root.mainloop()
