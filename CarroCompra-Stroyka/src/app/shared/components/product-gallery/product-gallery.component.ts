import { Component, ElementRef, HostBinding, Inject, Input, OnInit, PLATFORM_ID, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CarouselComponent, SlidesOutputData } from 'ngx-owl-carousel-o';
import { OwlCarouselOConfig } from 'ngx-owl-carousel-o/lib/carousel/owl-carousel-o-config';
import { PhotoSwipeItem, PhotoSwipeService, PhotoSwipeThumbBounds } from '../../services/photo-swipe.service';
import { DirectionService } from '../../services/direction.service';
import { isPlatformBrowser } from '@angular/common';
import { ProductLayout } from '../product/product.component';

export interface ProductGalleryItem {
    id: string;
    image: string;
}

@Component({
    selector: 'app-product-gallery',
    templateUrl: './product-gallery.component.html',
    styleUrls: ['./product-gallery.component.scss']
})
export class ProductGalleryComponent implements OnInit {
    @Input() productLayout: ProductLayout;

    @Input() set images(images: string[]) {
        this.items = images.map((image, index) => ({ id: `image-${index}`, image }));
        this.currentItem = this.items[0] || null;
    }

    items: ProductGalleryItem[] = [];
    currentItem: ProductGalleryItem | null = null;

    carouselOptions: Partial<OwlCarouselOConfig>;

    thumbnailsCarouselOptions: Partial<OwlCarouselOConfig>;

    @HostBinding('class.product-gallery') classProductGallery = true;

    @ViewChild('featuredCarousel', { read: CarouselComponent }) featuredCarousel: CarouselComponent;
    @ViewChild('thumbnailsCarousel', { read: CarouselComponent }) thumbnailsCarousel: CarouselComponent;
    @ViewChildren('imageElement', { read: ElementRef }) imageElements: QueryList<ElementRef>;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private photoSwipe: PhotoSwipeService,
        private direction: DirectionService
    ) { 
        this.carouselOptions = {
            dots: false,
            autoplay: false,
            responsive: {
                0: { items: 1 }
            },
            rtl: this.direction.isRTL()
        };
        this.thumbnailsCarouselOptions  = {
            dots: false,
            autoplay: false,
            margin: 10,
            items: 5,
            responsive: {
                480: { items: 5 },
                380: { items: 4 },
                0: { items: 3 }
            },
            rtl: this.direction.isRTL()
        };
    }

    ngOnInit(): void {
        if (this.productLayout !== 'quickview' && isPlatformBrowser(this.platformId)) {
            this.photoSwipe.load().subscribe();
        }
    }

    featuredCarouselTranslated(event: SlidesOutputData): void {
        if (event.slides.length) {
            const activeImageId = event.slides[0].id;
            this.currentItem = this.items.find(x => x.id === activeImageId) || this.items[0] || null;

            if (!this.thumbnailsCarousel.slidesData.find(slide => slide.id === activeImageId && slide.isActive)) {
                this.thumbnailsCarousel.to(activeImageId);
            }
        }
    }

    getDirDependentIndex(index: number): number {
        return this.direction.isRTL() ? this.items.length - 1 - index : index;
    }

    onFeaturedImageClick(event: MouseEvent, image: ProductGalleryItem): void {
        if (this.productLayout !== 'quickview') {
            event.preventDefault();
            this.openPhotoSwipe(image);
        }
    }

    onThumbnailImageClick(item: ProductGalleryItem): void {
        this.featuredCarousel.to(item.id);
        this.currentItem = item;
    }

    openPhotoSwipe(item: ProductGalleryItem): void {
        if (!item) return;

        const imageElements = this.imageElements.map(x => x.nativeElement);
        const images: PhotoSwipeItem[] = this.items.map((eachItem, i) => {
            const tag: HTMLImageElement = imageElements[i];
            const width = tag.naturalWidth;
            const height = tag.naturalHeight;

            return {
                src: eachItem.image,
                msrc: eachItem.image,
                w: width,
                h: height,
            };
        });

        if (this.direction.isRTL()) {
            images.reverse();
        }

        const options = {
            getThumbBoundsFn: index => this.getThumbBounds(index),
            index: this.getDirDependentIndex(this.items.indexOf(item)),
            bgOpacity: .9,
            history: false,
        };

        this.photoSwipe.open(images, options).subscribe(galleryRef => {
            galleryRef.listen('beforeChange', () => {
                this.featuredCarousel.to(this.items[this.getDirDependentIndex(galleryRef.getCurrentIndex())].id);
            });
        });
    }

    getThumbBounds(index: number): PhotoSwipeThumbBounds | null {
        const imageElements = this.imageElements.toArray();
        const dirDependentIndex = this.getDirDependentIndex(index);

        if (!imageElements[dirDependentIndex]) return null;

        const tag = imageElements[dirDependentIndex].nativeElement;
        const rect = tag.getBoundingClientRect();
        const ratio = Math.min(rect.width / tag.naturalWidth, rect.height / tag.naturalHeight);
        const fitWidth = tag.naturalWidth * ratio;
        const fitHeight = tag.naturalHeight * ratio;

        return {
            x: rect.left + (rect.width - fitWidth) / 2 + window.pageXOffset,
            y: rect.top + (rect.height - fitHeight) / 2 + window.pageYOffset,
            w: fitWidth,
        };
    }
}
