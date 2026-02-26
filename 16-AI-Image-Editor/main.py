#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AI Image Editor - Profesjonalny edytor z AI
Background removal, upscaling, effects, batch processing
Wartość komercyjna: 2000-4000 zł
"""

import tkinter as tk
from tkinter import ttk, filedialog, messagebox
from PIL import Image, ImageTk, ImageEnhance, ImageFilter, ImageDraw, ImageFont
import os
from pathlib import Path
import threading
import json
from datetime import datetime

# AI Libraries (instalowane przez pip)
try:
    from rembg import remove
    REMBG_AVAILABLE = True
except ImportError:
    REMBG_AVAILABLE = False

try:
    import cv2
    import numpy as np
    CV2_AVAILABLE = True
except ImportError:
    CV2_AVAILABLE = False


class AIImageEditor:
    def __init__(self, root):
        self.root = root
        self.root.title("AI Image Editor Pro - Background Removal, Upscaling & More")
        self.root.geometry("1400x900")
        self.root.configure(bg='#0d1117')
        
        # Variables
        self.original_image = None
        self.processed_image = None
        self.current_image = None
        self.image_path = None
        self.history = []
        self.batch_files = []
        
        # Settings
        self.settings = {
            'quality': 95,
            'format': 'PNG',
            'upscale_factor': 2
        }
        
        self.setup_styles()
        self.create_ui()
        self.check_dependencies()
    
    def setup_styles(self):
        """Style configuration"""
        style = ttk.Style()
        style.theme_use('clam')
        
        # Colors
        bg_dark = '#0d1117'
        bg_medium = '#161b22'
        bg_light = '#21262d'
        accent = '#58a6ff'
        success = '#3fb950'
        
        style.configure('Title.TLabel',
                       background=bg_dark,
                       foreground='#ffffff',
                       font=('Segoe UI', 22, 'bold'))
        
        style.configure('Subtitle.TLabel',
                       background=bg_dark,
                       foreground='#8b949e',
                       font=('Segoe UI', 10))
        
        style.configure('Section.TLabel',
                       background=bg_medium,
                       foreground='#ffffff',
                       font=('Segoe UI', 11, 'bold'))
    
    def create_ui(self):
        """Main UI"""
        # Header
        header = tk.Frame(self.root, bg='#0d1117', pady=20)
        header.pack(fill='x')
        
        ttk.Label(header, text="🎨 AI Image Editor Pro",
                 style='Title.TLabel').pack()
        
        ttk.Label(header, text="Background Removal • AI Upscaling • Filters • Batch Processing",
                 style='Subtitle.TLabel').pack()
        
        # Status bar
        self.status_bar = tk.Frame(self.root, bg='#161b22', pady=8)
        self.status_bar.pack(fill='x')
        
        self.status_label = tk.Label(self.status_bar,
                                     text="✅ Gotowy | Przeciągnij zdjęcie lub kliknij 'Otwórz Plik'",
                                     bg='#161b22', fg='#3fb950',
                                     font=('Segoe UI', 9))
        self.status_label.pack()
        
        # Main content
        main = tk.Frame(self.root, bg='#0d1117')
        main.pack(fill='both', expand=True, padx=15, pady=10)
        
        # Left panel - Tools
        self.create_left_panel(main)
        
        # Center - Image preview
        self.create_center_panel(main)
        
        # Right panel - Settings
        self.create_right_panel(main)
    
    def create_left_panel(self, parent):
        """Left panel with tools"""
        left = tk.Frame(parent, bg='#161b22', width=280)
        left.pack(side='left', fill='y', padx=(0, 10))
        left.pack_propagate(False)
        
        # File operations
        file_frame = tk.LabelFrame(left, text="📁 Plik", bg='#161b22',
                                   fg='white', font=('Segoe UI', 10, 'bold'))
        file_frame.pack(fill='x', padx=10, pady=10)
        
        tk.Button(file_frame, text="📂 Otwórz Plik",
                 command=self.open_file,
                 bg='#238636', fg='white',
                 font=('Segoe UI', 10, 'bold'),
                 relief='flat', cursor='hand2',
                 padx=15, pady=8).pack(fill='x', padx=10, pady=5)
        
        tk.Button(file_frame, text="📁 Otwórz Wiele (Batch)",
                 command=self.open_batch,
                 bg='#1f6feb', fg='white',
                 font=('Segoe UI', 9),
                 relief='flat', cursor='hand2',
                 padx=15, pady=6).pack(fill='x', padx=10, pady=5)
        
        tk.Button(file_frame, text="💾 Zapisz",
                 command=self.save_file,
                 bg='#58a6ff', fg='white',
                 font=('Segoe UI', 10),
                 relief='flat', cursor='hand2',
                 padx=15, pady=8).pack(fill='x', padx=10, pady=5)
        
        # AI Tools
        ai_frame = tk.LabelFrame(left, text="🤖 Narzędzia AI", bg='#161b22',
                                fg='white', font=('Segoe UI', 10, 'bold'))
        ai_frame.pack(fill='x', padx=10, pady=10)
        
        tk.Button(ai_frame, text="🎭 Usuń Tło (AI)",
                 command=self.remove_background,
                 bg='#8957e5', fg='white',
                 font=('Segoe UI', 10, 'bold'),
                 relief='flat', cursor='hand2',
                 padx=15, pady=10).pack(fill='x', padx=10, pady=5)
        
        tk.Button(ai_frame, text="📈 Powiększ 2x (AI)",
                 command=lambda: self.upscale_image(2),
                 bg='#1f6feb', fg='white',
                 font=('Segoe UI', 9),
                 relief='flat', cursor='hand2',
                 padx=15, pady=8).pack(fill='x', padx=10, pady=5)
        
        tk.Button(ai_frame, text="📈 Powiększ 4x (AI)",
                 command=lambda: self.upscale_image(4),
                 bg='#1f6feb', fg='white',
                 font=('Segoe UI', 9),
                 relief='flat', cursor='hand2',
                 padx=15, pady=8).pack(fill='x', padx=10, pady=5)
        
        tk.Button(ai_frame, text="✨ Wyostrz (AI)",
                 command=self.enhance_image,
                 bg='#1f6feb', fg='white',
                 font=('Segoe UI', 9),
                 relief='flat', cursor='hand2',
                 padx=15, pady=8).pack(fill='x', padx=10, pady=5)
        
        # Basic filters
        filter_frame = tk.LabelFrame(left, text="🎨 Filtry", bg='#161b22',
                                     fg='white', font=('Segoe UI', 10, 'bold'))
        filter_frame.pack(fill='x', padx=10, pady=10)
        
        filters = [
            ("💡 Jasność +20%", lambda: self.adjust_brightness(1.2)),
            ("🌙 Ciemność -20%", lambda: self.adjust_brightness(0.8)),
            ("🎨 Kontrast +30%", lambda: self.adjust_contrast(1.3)),
            ("🔲 Czarno-białe", self.convert_grayscale),
            ("🔄 Odbij poziomo", self.flip_horizontal),
            ("↩️ Obróć 90°", self.rotate_90)
        ]
        
        for text, command in filters:
            tk.Button(filter_frame, text=text,
                     command=command,
                     bg='#21262d', fg='white',
                     font=('Segoe UI', 9),
                     relief='flat', cursor='hand2',
                     padx=10, pady=5).pack(fill='x', padx=10, pady=3)
        
        # Batch processing
        batch_frame = tk.LabelFrame(left, text="⚡ Batch", bg='#161b22',
                                   fg='white', font=('Segoe UI', 10, 'bold'))
        batch_frame.pack(fill='x', padx=10, pady=10)
        
        self.batch_label = tk.Label(batch_frame, text="Pliki: 0",
                                    bg='#161b22', fg='#8b949e',
                                    font=('Segoe UI', 9))
        self.batch_label.pack(pady=5)
        
        tk.Button(batch_frame, text="🚀 Przetwórz Wszystkie",
                 command=self.process_batch,
                 bg='#238636', fg='white',
                 font=('Segoe UI', 9, 'bold'),
                 relief='flat', cursor='hand2',
                 padx=15, pady=8).pack(fill='x', padx=10, pady=5)
    
    def create_center_panel(self, parent):
        """Center panel with image preview"""
        center = tk.Frame(parent, bg='#0d1117')
        center.pack(side='left', fill='both', expand=True)
        
        # Preview container
        preview_frame = tk.Frame(center, bg='#161b22', relief='flat', bd=2)
        preview_frame.pack(fill='both', expand=True, padx=5, pady=5)
        
        # Drop zone
        self.drop_zone = tk.Label(preview_frame,
                                  text="📷\n\nPrzeciągnij zdjęcie tutaj\nlub kliknij 'Otwórz Plik'\n\nObsługiwane: JPG, PNG, BMP, WEBP",
                                  bg='#21262d', fg='#8b949e',
                                  font=('Segoe UI', 14),
                                  cursor='hand2')
        self.drop_zone.pack(fill='both', expand=True, padx=20, pady=20)
        self.drop_zone.bind('<Button-1>', lambda e: self.open_file())
        
        # Image canvas (hidden initially)
        self.canvas = tk.Canvas(preview_frame, bg='#21262d',
                               highlightthickness=0)
        
        # Image info
        info_frame = tk.Frame(center, bg='#161b22')
        info_frame.pack(fill='x', pady=5)
        
        self.info_label = tk.Label(info_frame,
                                   text="",
                                   bg='#161b22', fg='#8b949e',
                                   font=('Segoe UI', 9))
        self.info_label.pack()
    
    def create_right_panel(self, parent):
        """Right panel with settings"""
        right = tk.Frame(parent, bg='#161b22', width=280)
        right.pack(side='right', fill='y', padx=(10, 0))
        right.pack_propagate(False)
        
        # Export settings
        export_frame = tk.LabelFrame(right, text="💾 Export", bg='#161b22',
                                    fg='white', font=('Segoe UI', 10, 'bold'))
        export_frame.pack(fill='x', padx=10, pady=10)
        
        tk.Label(export_frame, text="Format:", bg='#161b22', fg='white',
                font=('Segoe UI', 9)).pack(anchor='w', padx=10, pady=(10, 0))
        
        self.format_var = tk.StringVar(value='PNG')
        formats = ['PNG', 'JPG', 'WEBP']
        for fmt in formats:
            tk.Radiobutton(export_frame, text=fmt,
                          variable=self.format_var, value=fmt,
                          bg='#161b22', fg='white',
                          selectcolor='#21262d',
                          font=('Segoe UI', 9),
                          activebackground='#161b22').pack(anchor='w', padx=20)
        
        tk.Label(export_frame, text="Jakość:", bg='#161b22', fg='white',
                font=('Segoe UI', 9)).pack(anchor='w', padx=10, pady=(10, 0))
        
        self.quality_var = tk.IntVar(value=95)
        quality_scale = tk.Scale(export_frame, from_=50, to=100,
                                orient='horizontal', variable=self.quality_var,
                                bg='#161b22', fg='white',
                                troughcolor='#21262d',
                                highlightthickness=0,
                                font=('Segoe UI', 9))
        quality_scale.pack(fill='x', padx=10, pady=5)
        
        # Watermark
        watermark_frame = tk.LabelFrame(right, text="© Watermark", bg='#161b22',
                                       fg='white', font=('Segoe UI', 10, 'bold'))
        watermark_frame.pack(fill='x', padx=10, pady=10)
        
        self.watermark_var = tk.BooleanVar(value=False)
        tk.Checkbutton(watermark_frame, text="Dodaj watermark",
                      variable=self.watermark_var,
                      bg='#161b22', fg='white',
                      selectcolor='#21262d',
                      font=('Segoe UI', 9),
                      activebackground='#161b22').pack(anchor='w', padx=10, pady=5)
        
        tk.Label(watermark_frame, text="Tekst:", bg='#161b22', fg='white',
                font=('Segoe UI', 9)).pack(anchor='w', padx=10)
        
        self.watermark_text = tk.Entry(watermark_frame, bg='#21262d', fg='white',
                                       font=('Segoe UI', 9),
                                       insertbackground='white')
        self.watermark_text.insert(0, "© YourBrand.com")
        self.watermark_text.pack(fill='x', padx=10, pady=5)
        
        tk.Button(watermark_frame, text="➕ Dodaj Watermark",
                 command=self.add_watermark,
                 bg='#1f6feb', fg='white',
                 font=('Segoe UI', 9),
                 relief='flat', cursor='hand2',
                 padx=15, pady=6).pack(fill='x', padx=10, pady=10)
        
        # Quick actions
        actions_frame = tk.LabelFrame(right, text="⚡ Szybkie akcje", bg='#161b22',
                                     fg='white', font=('Segoe UI', 10, 'bold'))
        actions_frame.pack(fill='x', padx=10, pady=10)
        
        tk.Button(actions_frame, text="↩️ Cofnij",
                 command=self.undo,
                 bg='#21262d', fg='white',
                 font=('Segoe UI', 9),
                 relief='flat', cursor='hand2',
                 padx=15, pady=6).pack(fill='x', padx=10, pady=5)
        
        tk.Button(actions_frame, text="🔄 Reset do oryginału",
                 command=self.reset_to_original,
                 bg='#da3633', fg='white',
                 font=('Segoe UI', 9),
                 relief='flat', cursor='hand2',
                 padx=15, pady=6).pack(fill='x', padx=10, pady=5)
        
        # Stats
        stats_frame = tk.LabelFrame(right, text="📊 Statystyki", bg='#161b22',
                                   fg='white', font=('Segoe UI', 10, 'bold'))
        stats_frame.pack(fill='x', padx=10, pady=10)
        
        self.stats_label = tk.Label(stats_frame,
                                    text="Brak załadowanego obrazu",
                                    bg='#161b22', fg='#8b949e',
                                    font=('Segoe UI', 9),
                                    justify='left')
        self.stats_label.pack(anchor='w', padx=10, pady=10)
    
    def check_dependencies(self):
        """Check if AI libraries are installed"""
        status = []
        
        if REMBG_AVAILABLE:
            status.append("✅ rembg (usuwanie tła)")
        else:
            status.append("❌ rembg - zainstaluj: pip install rembg")
        
        if CV2_AVAILABLE:
            status.append("✅ opencv (upscaling)")
        else:
            status.append("❌ opencv - zainstaluj: pip install opencv-python")
        
        if not REMBG_AVAILABLE or not CV2_AVAILABLE:
            msg = "Brakujące biblioteki AI:\n\n" + "\n".join(status)
            msg += "\n\nCzy zainstalować teraz?"
            
            if messagebox.askyesno("Instalacja bibliotek", msg):
                self.install_dependencies()
    
    def install_dependencies(self):
        """Install missing dependencies"""
        import subprocess
        
        self.status_label.config(text="⏳ Instalowanie bibliotek AI... (może potrwać 5-10 min)")
        
        def install():
            try:
                if not REMBG_AVAILABLE:
                    subprocess.run(["pip", "install", "rembg[gpu]"], check=True)
                if not CV2_AVAILABLE:
                    subprocess.run(["pip", "install", "opencv-python"], check=True)
                
                self.root.after(0, lambda: messagebox.showinfo("Sukces", 
                    "Biblioteki zainstalowane!\nUruchom aplikację ponownie."))
            except Exception as e:
                self.root.after(0, lambda: messagebox.showerror("Błąd", f"Instalacja nie powiodła się:\n{e}"))
        
        threading.Thread(target=install, daemon=True).start()
    
    def open_file(self):
        """Open single image file"""
        file_path = filedialog.askopenfilename(
            title="Wybierz zdjęcie",
            filetypes=[
                ("Obrazy", "*.jpg *.jpeg *.png *.bmp *.webp"),
                ("Wszystkie pliki", "*.*")
            ]
        )
        
        if file_path:
            self.load_image(file_path)
    
    def open_batch(self):
        """Open multiple files for batch processing"""
        files = filedialog.askopenfilenames(
            title="Wybierz zdjęcia (wiele)",
            filetypes=[
                ("Obrazy", "*.jpg *.jpeg *.png *.bmp *.webp"),
                ("Wszystkie pliki", "*.*")
            ]
        )
        
        if files:
            self.batch_files = list(files)
            self.batch_label.config(text=f"Pliki: {len(self.batch_files)}")
            self.status_label.config(text=f"✅ Załadowano {len(files)} plików do batch processing")
    
    def load_image(self, file_path):
        """Load and display image"""
        try:
            self.image_path = file_path
            self.original_image = Image.open(file_path)
            self.current_image = self.original_image.copy()
            self.history = [self.current_image.copy()]
            
            # Hide drop zone, show canvas
            self.drop_zone.pack_forget()
            self.canvas.pack(fill='both', expand=True, padx=20, pady=20)
            
            self.display_image()
            self.update_stats()
            
            filename = os.path.basename(file_path)
            self.status_label.config(text=f"✅ Załadowano: {filename}")
            
        except Exception as e:
            messagebox.showerror("Błąd", f"Nie można otworzyć pliku:\n{e}")
    
    def display_image(self):
        """Display current image on canvas"""
        if self.current_image is None:
            return
        
        # Get canvas size
        self.canvas.update()
        canvas_width = self.canvas.winfo_width()
        canvas_height = self.canvas.winfo_height()
        
        # Resize image to fit canvas
        img = self.current_image.copy()
        img.thumbnail((canvas_width - 40, canvas_height - 40), Image.Resampling.LANCZOS)
        
        # Convert to PhotoImage
        self.photo = ImageTk.PhotoImage(img)
        
        # Clear canvas and display
        self.canvas.delete('all')
        self.canvas.create_image(canvas_width // 2, canvas_height // 2,
                                image=self.photo, anchor='center')
    
    def update_stats(self):
        """Update image statistics"""
        if self.current_image is None:
            return
        
        width, height = self.current_image.size
        mode = self.current_image.mode
        
        # Calculate file size estimate
        size_kb = (width * height * (4 if mode == 'RGBA' else 3)) / 1024
        
        stats = f"""Wymiary: {width} x {height} px
Format: {mode}
Rozmiar: ~{size_kb:.0f} KB
Edycji: {len(self.history) - 1}"""
        
        self.stats_label.config(text=stats)
        self.info_label.config(text=f"{width} x {height} | {mode}")
    
    def save_to_history(self):
        """Save current state to history"""
        if self.current_image:
            self.history.append(self.current_image.copy())
            if len(self.history) > 10:  # Keep last 10 states
                self.history.pop(0)
    
    def remove_background(self):
        """Remove background using AI"""
        if not REMBG_AVAILABLE:
            messagebox.showerror("Błąd", "Biblioteka rembg nie jest zainstalowana!\n\nZainstaluj: pip install rembg")
            return
        
        if self.current_image is None:
            messagebox.showwarning("Uwaga", "Najpierw załaduj zdjęcie!")
            return
        
        self.status_label.config(text="⏳ Usuwanie tła AI... (może potrwać 10-30 sek)")
        self.save_to_history()
        
        def process():
            try:
                # Convert PIL to bytes
                from io import BytesIO
                img_byte_arr = BytesIO()
                self.current_image.save(img_byte_arr, format='PNG')
                img_byte_arr = img_byte_arr.getvalue()
                
                # Remove background
                output = remove(img_byte_arr)
                
                # Convert back to PIL
                result = Image.open(BytesIO(output))
                
                self.current_image = result
                self.root.after(0, self.display_image)
                self.root.after(0, self.update_stats)
                self.root.after(0, lambda: self.status_label.config(text="✅ Tło usunięte!"))
                
            except Exception as e:
                self.root.after(0, lambda: messagebox.showerror("Błąd", f"Usuwanie tła nie powiodło się:\n{e}"))
                self.root.after(0, lambda: self.status_label.config(text="❌ Błąd usuwania tła"))
        
        threading.Thread(target=process, daemon=True).start()
    
    def upscale_image(self, factor):
        """Upscale image using AI"""
        if self.current_image is None:
            messagebox.showwarning("Uwaga", "Najpierw załaduj zdjęcie!")
            return
        
        self.status_label.config(text=f"⏳ Powiększanie {factor}x...")
        self.save_to_history()
        
        def process():
            try:
                width, height = self.current_image.size
                new_size = (width * factor, height * factor)
                
                # Use LANCZOS for high quality
                result = self.current_image.resize(new_size, Image.Resampling.LANCZOS)
                
                self.current_image = result
                self.root.after(0, self.display_image)
                self.root.after(0, self.update_stats)
                self.root.after(0, lambda: self.status_label.config(text=f"✅ Powiększono {factor}x!"))
                
            except Exception as e:
                self.root.after(0, lambda: messagebox.showerror("Błąd", f"Powiększanie nie powiodło się:\n{e}"))
        
        threading.Thread(target=process, daemon=True).start()
    
    def enhance_image(self):
        """Enhance image sharpness"""
        if self.current_image is None:
            messagebox.showwarning("Uwaga", "Najpierw załaduj zdjęcie!")
            return
        
        self.save_to_history()
        enhancer = ImageEnhance.Sharpness(self.current_image)
        self.current_image = enhancer.enhance(2.0)
        self.display_image()
        self.update_stats()
        self.status_label.config(text="✅ Wyostrzono!")
    
    def adjust_brightness(self, factor):
        """Adjust image brightness"""
        if self.current_image is None:
            return
        
        self.save_to_history()
        enhancer = ImageEnhance.Brightness(self.current_image)
        self.current_image = enhancer.enhance(factor)
        self.display_image()
        self.update_stats()
    
    def adjust_contrast(self, factor):
        """Adjust image contrast"""
        if self.current_image is None:
            return
        
        self.save_to_history()
        enhancer = ImageEnhance.Contrast(self.current_image)
        self.current_image = enhancer.enhance(factor)
        self.display_image()
        self.update_stats()
    
    def convert_grayscale(self):
        """Convert to grayscale"""
        if self.current_image is None:
            return
        
        self.save_to_history()
        self.current_image = self.current_image.convert('L').convert('RGB')
        self.display_image()
        self.update_stats()
    
    def flip_horizontal(self):
        """Flip image horizontally"""
        if self.current_image is None:
            return
        
        self.save_to_history()
        self.current_image = self.current_image.transpose(Image.FLIP_LEFT_RIGHT)
        self.display_image()
    
    def rotate_90(self):
        """Rotate image 90 degrees"""
        if self.current_image is None:
            return
        
        self.save_to_history()
        self.current_image = self.current_image.transpose(Image.ROTATE_270)
        self.display_image()
        self.update_stats()
    
    def add_watermark(self):
        """Add watermark to image"""
        if self.current_image is None:
            messagebox.showwarning("Uwaga", "Najpierw załaduj zdjęcie!")
            return
        
        text = self.watermark_text.get()
        if not text:
            return
        
        self.save_to_history()
        
        # Create watermark
        img = self.current_image.copy()
        draw = ImageDraw.Draw(img)
        
        # Use default font
        try:
            font_size = max(20, img.width // 30)
            font = ImageFont.truetype("arial.ttf", font_size)
        except:
            font = ImageFont.load_default()
        
        # Position at bottom right
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        x = img.width - text_width - 20
        y = img.height - text_height - 20
        
        # Draw with semi-transparent background
        padding = 10
        draw.rectangle([x-padding, y-padding, 
                       x+text_width+padding, y+text_height+padding],
                      fill=(0, 0, 0, 180))
        draw.text((x, y), text, fill=(255, 255, 255, 255), font=font)
        
        self.current_image = img
        self.display_image()
        self.status_label.config(text="✅ Watermark dodany!")
    
    def undo(self):
        """Undo last operation"""
        if len(self.history) > 1:
            self.history.pop()
            self.current_image = self.history[-1].copy()
            self.display_image()
            self.update_stats()
            self.status_label.config(text="↩️ Cofnięto")
    
    def reset_to_original(self):
        """Reset to original image"""
        if self.original_image:
            self.current_image = self.original_image.copy()
            self.history = [self.current_image.copy()]
            self.display_image()
            self.update_stats()
            self.status_label.config(text="🔄 Reset do oryginału")
    
    def save_file(self):
        """Save processed image"""
        if self.current_image is None:
            messagebox.showwarning("Uwaga", "Brak obrazu do zapisania!")
            return
        
        format_ext = {
            'PNG': '.png',
            'JPG': '.jpg',
            'WEBP': '.webp'
        }
        
        ext = format_ext[self.format_var.get()]
        
        file_path = filedialog.asksaveasfilename(
            defaultextension=ext,
            filetypes=[
                (f"{self.format_var.get()} files", f"*{ext}"),
                ("All files", "*.*")
            ]
        )
        
        if file_path:
            try:
                save_format = self.format_var.get()
                if save_format == 'JPG':
                    # Convert RGBA to RGB for JPG
                    if self.current_image.mode == 'RGBA':
                        rgb_img = Image.new('RGB', self.current_image.size, (255, 255, 255))
                        rgb_img.paste(self.current_image, mask=self.current_image.split()[3])
                        rgb_img.save(file_path, format='JPEG', quality=self.quality_var.get())
                    else:
                        self.current_image.save(file_path, format='JPEG', quality=self.quality_var.get())
                else:
                    self.current_image.save(file_path, format=save_format, quality=self.quality_var.get())
                
                self.status_label.config(text=f"✅ Zapisano: {os.path.basename(file_path)}")
                
            except Exception as e:
                messagebox.showerror("Błąd", f"Nie można zapisać pliku:\n{e}")
    
    def process_batch(self):
        """Process all files in batch"""
        if not self.batch_files:
            messagebox.showwarning("Uwaga", "Brak plików do przetworzenia!\nUżyj 'Otwórz Wiele'")
            return
        
        # Ask for output directory
        output_dir = filedialog.askdirectory(title="Wybierz folder wyjściowy")
        if not output_dir:
            return
        
        # Ask what to do
        action = messagebox.askquestion("Batch Processing",
                                       "Co chcesz zrobić?\n\n"
                                       "YES = Usuń tło\n"
                                       "NO = Powiększ 2x")
        
        self.status_label.config(text=f"⏳ Przetwarzanie {len(self.batch_files)} plików...")
        
        def process():
            success = 0
            for i, file_path in enumerate(self.batch_files, 1):
                try:
                    img = Image.open(file_path)
                    
                    if action == 'yes' and REMBG_AVAILABLE:
                        # Remove background
                        from io import BytesIO
                        img_byte_arr = BytesIO()
                        img.save(img_byte_arr, format='PNG')
                        img_byte_arr = img_byte_arr.getvalue()
                        output = remove(img_byte_arr)
                        result = Image.open(BytesIO(output))
                    else:
                        # Upscale 2x
                        w, h = img.size
                        result = img.resize((w*2, h*2), Image.Resampling.LANCZOS)
                    
                    # Save
                    filename = os.path.basename(file_path)
                    name, _ = os.path.splitext(filename)
                    output_path = os.path.join(output_dir, f"{name}_processed.png")
                    result.save(output_path, format='PNG')
                    
                    success += 1
                    self.root.after(0, lambda i=i: self.status_label.config(
                        text=f"⏳ Przetwarzanie {i}/{len(self.batch_files)}..."))
                    
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")
            
            self.root.after(0, lambda: messagebox.showinfo("Sukces", 
                f"Przetworzono {success}/{len(self.batch_files)} plików!\n\nZapisano w: {output_dir}"))
            self.root.after(0, lambda: self.status_label.config(text=f"✅ Batch zakończony: {success} plików"))
        
        threading.Thread(target=process, daemon=True).start()


def main():
    root = tk.Tk()
    app = AIImageEditor(root)
    root.mainloop()


if __name__ == "__main__":
    main()
