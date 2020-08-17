import { NavigationLink } from '../app/shared/interfaces/navigation-link';
import {StoreService } from '../app/shared/services/store.service';


class Nave {

    constructor() {

        this.getNavigation();
    }

    public navigation: NavigationLink[] = [
        {label: 'Inicio', url: '/'},
        {label: 'Comprar', url: '/shop/catalog/power-tools', menu: {
            type: 'menu',
            items: [
                {label: 'Artículos', url: '/shop/catalog/power-tools' , items: [
                    {label: '3 Columns Sidebar', url: '/shop/catalog/power-tools'},
                    {label: '4 Columns Full',    url: '/shop/category-grid-4-columns-full'},
                    {label: '5 Columns Full',    url: '/shop/category-grid-5-columns-full'}
                ]},
                {label: 'Shop List', url: '/shop/category-list'},
                {label: 'Shop Right Sidebar', url: '/shop/category-right-sidebar'},
                {label: 'Product', url: '/shop/product-standard', items: [
                    {label: 'Product', url: '/shop/product-standard'},
                    {label: 'Product Alt', url: '/shop/product-columnar'},
                    {label: 'Product Sidebar', url: '/shop/product-sidebar'}
                ]},
                {label: 'Lista de Deseos', url: '/shop/wishlist'},
                {label: 'Comparar', url: '/shop/compare'},
            ]
        }},
        {label: 'Cuenta', url: '/account', menu: {
            type: 'menu',
            items: [
                {label: 'Login',           url: '/account/login'},
                {label: 'Dashboard',       url: '/account/dashboard'},
                {label: 'Edit Profile',    url: '/account/profile'},
                {label: 'Order History',   url: '/account/orders'},
                {label: 'Order Details',   url: '/account/orders/5'},
                {label: 'Address Book',    url: '/account/addresses'},
                {label: 'Edit Address',    url: '/account/addresses/5'},
                {label: 'Change Password', url: '/account/password'}
            ]
        }},
        {label: 'Blog', url: '/blog/category-grid'},
        {label: 'Sitios', url: '/site', menu: {
            type: 'menu',
            items: [
                {label: 'Acerca de Nosotros',             url: '/site/about-us'},
                {label: 'Contactanos',           url: '/site/contact-us'},
                {label: 'Terminos', url: '/site/terms'},
                {label: 'FAQ',                  url: '/site/faq'},
            ]
        }}
    ];

    getNavigation(): NavigationLink[] {
        return this.navigation;
    }
}

export const navigation: NavigationLink[] = new Nave().getNavigation();


/*
export const navigation: NavigationLink[] = [
    {label: 'Inicio', url: '/'},
    {label: 'Comprar', url: '/shop/catalog/power-tools', menu: {
        type: 'menu',
        items: [
            {label: 'Artículos', url: '/shop/catalog/power-tools' , items: [
                {label: '3 Columns Sidebar', url: '/shop/catalog/power-tools'},
                {label: '4 Columns Full',    url: '/shop/category-grid-4-columns-full'},
                {label: '5 Columns Full',    url: '/shop/category-grid-5-columns-full'}
            ]},
            {label: 'Shop List', url: '/shop/category-list'},
            {label: 'Shop Right Sidebar', url: '/shop/category-right-sidebar'},
            {label: 'Product', url: '/shop/product-standard', items: [
                {label: 'Product', url: '/shop/product-standard'},
                {label: 'Product Alt', url: '/shop/product-columnar'},
                {label: 'Product Sidebar', url: '/shop/product-sidebar'}
            ]},
            {label: 'Lista de Deseos', url: '/shop/wishlist'},
            {label: 'Comparar', url: '/shop/compare'},
        ]
    }},
    {label: 'Cuenta', url: '/account', menu: {
        type: 'menu',
        items: [
            {label: 'Login',           url: '/account/login'},
            {label: 'Dashboard',       url: '/account/dashboard'},
            {label: 'Edit Profile',    url: '/account/profile'},
            {label: 'Order History',   url: '/account/orders'},
            {label: 'Order Details',   url: '/account/orders/5'},
            {label: 'Address Book',    url: '/account/addresses'},
            {label: 'Edit Address',    url: '/account/addresses/5'},
            {label: 'Change Password', url: '/account/password'}
        ]
    }},
    {label: 'Blog', url: '/blog/category-grid'},
    {label: 'Sitios', url: '/site', menu: {
        type: 'menu',
        items: [
            {label: 'Acerca de Nosotros',             url: '/site/about-us'},
            {label: 'Contactanos',           url: '/site/contact-us'},
            {label: 'Terminos', url: '/site/terms'},
            {label: 'FAQ',                  url: '/site/faq'},
        ]
    }}
];
*/
