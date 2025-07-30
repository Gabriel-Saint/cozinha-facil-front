import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-lessons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-lessons.component.html',
  styleUrls: ['./video-lessons.component.scss']
})
export class VideoLessonsComponent {
  videos: { title: string; embedUrl: SafeResourceUrl }[];

  constructor(private sanitizer: DomSanitizer) {
    const videoData = [
      {
        title: 'Bolo Fofinho (3 Ingredientes)',
        url: 'https://www.youtube.com/embed/MzbQnWOVYk8?si=qqdzNalvCvbkWXrC'
      },
      {
        title: 'Morango do Amor (Faça e Venda)',
        url: 'https://www.youtube.com/embed/Ye0FsA0dMtU?si=C2nD4brMiXRU0tkn'
      },
      {
        title: 'Bolo de Fubá sem Açúcar',
        url: 'https://www.youtube.com/embed/eIKM6tLRo_Y?si=kEyeEnZ7CkpIuB76'
      }
    ];

    this.videos = videoData.map(video => ({
      title: video.title,
      embedUrl: this.sanitizer.bypassSecurityTrustResourceUrl(video.url)
    }));
  }
}
