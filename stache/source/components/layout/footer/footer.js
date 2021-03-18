const Footer = (function (global) {
    const yearElement = '.footer__copyright-year';
    const currentYear = new Date().getFullYear();

    return (actions) => {

        function load() {
            updateFooterYear();
            console.log('Footer loaded');
        }

        function updateFooterYear() {
            $(yearElement).text(currentYear);
        };

        switch (actions) {
            case 'updateFooterYear':
                return updateFooterYear();
            default:
                load();
        }
    };

}(window))

Footer();
