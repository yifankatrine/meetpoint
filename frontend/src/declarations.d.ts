declare global {
    interface Window {
        ymaps: typeof import('yandex-maps');
    }
}