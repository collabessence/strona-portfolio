#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AI Image Editor - DEMO VERSION (bez wymagań zewnętrznych)
Działa tylko z tkinter i PIL (built-in w większości instalacji Python)
"""

import tkinter as tk
from tkinter import ttk, filedialog, messagebox
from PIL import Image, ImageTk, ImageEnhance, ImageFilter, ImageDraw, ImageFont
import os
from pathlib import Path


class ImageEditorDemo:
    def __init__(self, root):
        self.root = root
        self.root.title("AI Image Editor - DEMO (Basic Filters)")
        self.root.geometry("1200x700")
        self.root.configure(bg='#0d1117')
        
        self.original_image = None
        self.current_image = None
        self.image_path = None
        self.history = []
        
        self.create_ui()
    
    def create_ui(self):
        """Main UI"""
        # Header
        header = tk.Frame(self.root, bg='#0d1117', pady=15)
        header.pack(fill='x')
        
        tk.Label(header, text="🎨 AI Image Editor - DEMO",
                bg='#0d1117', fg='white',
                font=('Segoe UI', 20, 'bold')).pack()
        
        tk.Label(header, text="Filters • Resize • Watermark • Batch",
                bg='#0d1117', fg='#8b949e',
                font=('Segoe UI', 9)).pack()
        
        # Status
        self.status_bar = tk.Frame(self.root, bg='#161b22', pady=8)
        self.status_bar.pack(fill='x')
        
        self.status_label = tk.Label(self.status_bar,
                                     text="✅ Gotowy - Kliknij 'Otwórz' aby załadować zdjęcie",
                                     bg='#161b22', fg='#3fb950',
                                     font=('Segoe UI', 9))
        self.status_label.pack()
        
        # Main
        main = tk.Frame(self.root, bg='#0d1117')
        main.pack(fill='both', expand=True, padx=15, pady=10)
        
        # Left panel
        left = tk.Frame(main, bg='#161b22', width=250)
        left.pack(side='left', fill='y', padx=(0, 10))
        left.pack_propagate(False)
        
        # File buttons
        file_frame = tk.LabelFrame(left, text="📁 Plik", bg='#161b22',
                                   fg='white', font=('Segoe UI', 10, 'bold'))
        file_frame.pack(fill='x', padx=10, pady=10)
        
        tk.Button(file_frame, text="📂 Otwórz",
                 command=self.open_file,
                 bg='#238636', fg='white',
                 font=('Segoe UI', 10, 'bold'),
                 relief='flat', cursor='hand2',
                 padx=15, pady=8).pack(fill='x', padx=10, pady=5)
        
        tk.Button(file_frame, text="💾 Zapisz",
                 command=self.save_file,
                 bg='#1f6feb', fg='white',
                 font=('Segoe UI', 10),
                 relief='flat', cursor='hand2',
                 padx=15, pady=8).pack(fill='x', padx=10, pady=5)
        
        # Filters
        filter_frame = tk.LabelFrame(left, text="🎨 Filtry", bg='#161b22',
                                     fg='white', font=('Segoe UI', 10, 'bold'))
        filter_frame.pack(fill='x', padx=10, pady=10)
        
        filters = [
            ("💡 Jasność +30%", lambda: self.adjust_brightness(1.3)),
            ("🌙 Ciemność -30%", lambda: self.adjust_brightness(0.7)),
            ("🎨 Kontrast +50%", lambda: self.adjust_contrast(1.5)),
            ("✨ Wyostrz", self.sharpen),
            ("🔲 Czarno-białe", self.grayscale),
            ("🌀 Blur", self.blur),
            ("🔄 Odbij H", self.flip_h),
            ("↩️ Obróć 90°", self.rotate_90)
        ]
        
        for text, command in filters:
            tk.Button(filter_frame, text=text,
                     command=command,
                     bg='#21262d', fg='white',
                     font=('Segoe UI', 9),
                     relief='flat', cursor='hand2',
                     padx=10, pady=5).pack(fill='x', padx=10, pady=2)
        
        # Resize
        resize_frame = tk.LabelFrame(left, text="📐 Rozmiar", bg='#161b22',
                                     fg='white', font=('Segoe UI', 10, 'bold'))
        resize_frame.pack(fill='x', padx=10, pady=10)
        
        tk.Button(resize_frame, text="📈 Powiększ 2x",
                 command=lambda: self.resize(2),
                 bg='#8957e5', fg='white',
                 font=('Segoe UI', 9),
                 relief='flat', cursor='hand2',
                 padx=10, pady=6).pack(fill='x', padx=10, pady=3)
        
        tk.Button(resize_frame, text="📉 Zmniejsz 50%",
                 command=lambda: self.resize(0.5),
                 bg='#8957e5', fg='white',
                 font=('Segoe UI', 9),
                 relief='flat', cursor='hand2',
                 padx=10, pady=6).pack(fill='x', padx=10, pady=3)
        
        # Actions
        action_frame = tk.LabelFrame(left, text="⚡ Akcje", bg='#161b22',
                                     fg='white', font=('Segoe UI', 10, 'bold'))
        action_frame.pack(fill='x', padx=10, pady=10)
        
        tk.Button(action_frame, text="↩️ Cofnij",
                 command=self.undo,
                 bg='#21262d', fg='white',
                 font=('Segoe UI', 9),
                 relief='flat', cursor='hand2',
                 padx=10, pady=6).pack(fill='x', padx=10, pady=5)
        
        tk.Button(action_frame, text="🔄 Reset",
                 command=self.reset,
                 bg='#da3633', fg='white',
                 font=('Segoe UI', 9),
                 relief='flat', cursor='hand2',
                 padx=10, pady=6).pack(fill='x', padx=10, pady=5)
        
        # Center - Preview
        center = tk.Frame(main, bg='#161b22', relief='flat', bd=2)
        center.pack(side='left', fill='both', expand=True, padx=5)
        
        self.canvas = tk.Canvas(center, bg='#21262d', highlightthickness=0)
        self.canvas.pack(fill='both', expand=True, padx=20, pady=20)
        
        # Instructions
        self.canvas.create_text(
            400, 250,
            text="📷\n\nKliknij 'Otwórz' aby załadować zdjęcie\n\nObsługiwane: JPG, PNG, BMP",
            fill='#8b949e',
            font=('Segoe UI', 14),
            justify='center'
        )
        
        # Right - Info
        right = tk.Frame(main, bg='#161b22', width=200)
        right.pack(side='right', fill='y', padx=(10, 0))
        right.pack_propagate(False)
        
        info_frame = tk.LabelFrame(right, text="📊 Info", bg='#161b22',
                                   fg='white', font=('Segoe UI', 10, 'bold'))
        info_frame.pack(fill='x', padx=10, pady=10)
        
        self.info_label = tk.Label(info_frame,
                                   text="Brak obrazu",
                                   bg='#161b22', fg='#8b949e',
                                   font=('Segoe UI', 9),
                                   justify='left')
        self.info_label.pack(anchor='w', padx=10, pady=10)
    
    def open_file(self):
        """Open image"""
        file_path = filedialog.askopenfilename(
            title="Wybierz zdjęcie",
            filetypes=[
                ("Obrazy", "*.jpg *.jpeg *.png *.bmp"),
                ("Wszystkie", "*.*")
            ]
        )
        
        if file_path:
            try:
                self.image_path = file_path
                self.original_image = Image.open(file_path)
                self.current_image = self.original_image.copy()
                self.history = [self.current_image.copy()]
                
                self.display()
                self.update_info()
                
                filename = os.path.basename(file_path)
                self.status_label.config(text=f"✅ Załadowano: {filename}")
                
            except Exception as e:
                messagebox.showerror("Błąd", f"Nie można otworzyć:\n{e}")
    
    def display(self):
        """Display image"""
        if self.current_image is None:
            return
        
        self.canvas.update()
        w = self.canvas.winfo_width()
        h = self.canvas.winfo_height()
        
        img = self.current_image.copy()
        img.thumbnail((w-40, h-40), Image.Resampling.LANCZOS)
        
        self.photo = ImageTk.PhotoImage(img)
        
        self.canvas.delete('all')
        self.canvas.create_image(w//2, h//2, image=self.photo, anchor='center')
    
    def update_info(self):
        """Update info"""
        if self.current_image is None:
            return
        
        w, h = self.current_image.size
        mode = self.current_image.mode
        size_kb = (w * h * 3) / 1024
        
        info = f"""Wymiary:
{w} x {h} px

Format: {mode}

Rozmiar:
~{size_kb:.0f} KB

Edycji: {len(self.history)-1}"""
        
        self.info_label.config(text=info)
    
    def save_history(self):
        """Save to history"""
        if self.current_image:
            self.history.append(self.current_image.copy())
            if len(self.history) > 10:
                self.history.pop(0)
    
    def adjust_brightness(self, factor):
        """Brightness"""
        if self.current_image is None:
            messagebox.showwarning("Uwaga", "Najpierw załaduj zdjęcie!")
            return
        
        self.save_history()
        enhancer = ImageEnhance.Brightness(self.current_image)
        self.current_image = enhancer.enhance(factor)
        self.display()
        self.update_info()
        self.status_label.config(text="✅ Zmieniono jasność")
    
    def adjust_contrast(self, factor):
        """Contrast"""
        if self.current_image is None:
            return
        
        self.save_history()
        enhancer = ImageEnhance.Contrast(self.current_image)
        self.current_image = enhancer.enhance(factor)
        self.display()
        self.update_info()
        self.status_label.config(text="✅ Zmieniono kontrast")
    
    def sharpen(self):
        """Sharpen"""
        if self.current_image is None:
            return
        
        self.save_history()
        self.current_image = self.current_image.filter(ImageFilter.SHARPEN)
        self.display()
        self.update_info()
        self.status_label.config(text="✅ Wyostrzono")
    
    def blur(self):
        """Blur"""
        if self.current_image is None:
            return
        
        self.save_history()
        self.current_image = self.current_image.filter(ImageFilter.BLUR)
        self.display()
        self.update_info()
        self.status_label.config(text="✅ Rozmyto")
    
    def grayscale(self):
        """Grayscale"""
        if self.current_image is None:
            return
        
        self.save_history()
        self.current_image = self.current_image.convert('L').convert('RGB')
        self.display()
        self.update_info()
        self.status_label.config(text="✅ Czarno-białe")
    
    def flip_h(self):
        """Flip horizontal"""
        if self.current_image is None:
            return
        
        self.save_history()
        self.current_image = self.current_image.transpose(Image.FLIP_LEFT_RIGHT)
        self.display()
        self.status_label.config(text="✅ Odbito")
    
    def rotate_90(self):
        """Rotate 90"""
        if self.current_image is None:
            return
        
        self.save_history()
        self.current_image = self.current_image.transpose(Image.ROTATE_270)
        self.display()
        self.update_info()
        self.status_label.config(text="✅ Obrócono")
    
    def resize(self, factor):
        """Resize"""
        if self.current_image is None:
            messagebox.showwarning("Uwaga", "Najpierw załaduj zdjęcie!")
            return
        
        self.save_history()
        w, h = self.current_image.size
        new_size = (int(w * factor), int(h * factor))
        self.current_image = self.current_image.resize(new_size, Image.Resampling.LANCZOS)
        self.display()
        self.update_info()
        self.status_label.config(text=f"✅ Zmieniono rozmiar {factor}x")
    
    def undo(self):
        """Undo"""
        if len(self.history) > 1:
            self.history.pop()
            self.current_image = self.history[-1].copy()
            self.display()
            self.update_info()
            self.status_label.config(text="↩️ Cofnięto")
        else:
            messagebox.showinfo("Info", "Brak operacji do cofnięcia")
    
    def reset(self):
        """Reset"""
        if self.original_image:
            self.current_image = self.original_image.copy()
            self.history = [self.current_image.copy()]
            self.display()
            self.update_info()
            self.status_label.config(text="🔄 Reset")
    
    def save_file(self):
        """Save"""
        if self.current_image is None:
            messagebox.showwarning("Uwaga", "Brak obrazu do zapisania!")
            return
        
        file_path = filedialog.asksaveasfilename(
            defaultextension=".png",
            filetypes=[
                ("PNG", "*.png"),
                ("JPG", "*.jpg"),
                ("All", "*.*")
            ]
        )
        
        if file_path:
            try:
                if file_path.lower().endswith('.jpg') or file_path.lower().endswith('.jpeg'):
                    if self.current_image.mode == 'RGBA':
                        rgb = Image.new('RGB', self.current_image.size, (255, 255, 255))
                        rgb.paste(self.current_image, mask=self.current_image.split()[3] if len(self.current_image.split()) == 4 else None)
                        rgb.save(file_path, 'JPEG', quality=95)
                    else:
                        self.current_image.save(file_path, 'JPEG', quality=95)
                else:
                    self.current_image.save(file_path)
                
                self.status_label.config(text=f"✅ Zapisano: {os.path.basename(file_path)}")
                
            except Exception as e:
                messagebox.showerror("Błąd", f"Nie można zapisać:\n{e}")


if __name__ == "__main__":
    root = tk.Tk()
    app = ImageEditorDemo(root)
    root.mainloop()
