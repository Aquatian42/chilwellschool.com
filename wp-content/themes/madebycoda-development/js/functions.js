(function () {
    function initDropdown() {
        const links = document.querySelectorAll('.quicklink-toggle');
        const nav = document.getElementById('navigation');
        const menuButton = document.createElement('button');
        menuButton.classList.add('menu-button');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-controls', 'navigation');
        menuButton.textContent = 'Menu';
        nav.parentNode.insertBefore(menuButton, nav);

        const srStatus = document.createElement('div');
        srStatus.setAttribute('aria-live', 'polite');
        srStatus.setAttribute('role', 'status');
        srStatus.classList.add('screen-reader-text');
        document.body.appendChild(srStatus);

        links.forEach(link => {
            const arrow = document.createElement('span');
            arrow.classList.add('dropdown-arrow');
            arrow.setAttribute('aria-hidden', 'true'); // Hide from screen readers
            arrow.innerHTML = '\u25BC'; // Down arrow
            link.appendChild(arrow);
        });

        function toggleNav(open) {
            document.body.classList.toggle('menu-open', open);
            if (!open) {
                srStatus.textContent = 'Menu closed'; // Announce when menu is closed
                document.querySelectorAll('.quicklink-menu.open').forEach(menu => {
                    const link = menu.previousElementSibling;
                    if (link) {
                        link.setAttribute('aria-expanded', 'false');
                    }
                    menu.setAttribute('aria-hidden', 'true');
                    menu.style.display = 'none';
                    menu.classList.remove('open');
                });
            }
            if (!open) {
                document.querySelectorAll('.quicklink-menu.open').forEach(menu => {
                    const link = menu.previousElementSibling;
                    if (link) {
                        link.setAttribute('aria-expanded', 'false');
                    }
                    menu.setAttribute('aria-hidden', 'true');
                    menu.style.display = 'none';
                    menu.classList.remove('open');
                });
            }
            menuButton.setAttribute('aria-expanded', open.toString());
            nav.classList.toggle('menu-open', open);
            nav.setAttribute('aria-hidden', open ? 'false' : 'true');
            menuButton.textContent = open ? 'Close' : 'Menu';
            const navLinks = nav.querySelectorAll('a');
            navLinks.forEach(link => {
                link.tabIndex = open ? "0" : "-1";
            });

            if (!open) {
                srStatus.textContent = 'Menu collapsed';
            }

            if (open) {
                // Move focus to the first link in the nav for better accessibility
                const firstNavLink = nav.querySelector('a');
                if (firstNavLink) {
                    firstNavLink.focus();
                }
                navLinks[navLinks.length - 1].addEventListener('blur', closeOnTabExit);
            } else {
                navLinks[navLinks.length - 1].removeEventListener('blur', closeOnTabExit);
            }
        }

        function closeOnTabExit() {
            setTimeout(() => {
                if (!nav.contains(document.activeElement) && !menuButton.contains(document.activeElement)) {
                    toggleNav(false);
                }
            }, 10);
        }

        menuButton.addEventListener('click', function () {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            toggleNav(!isExpanded);
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                toggleNav(false);
            }
        });

        document.addEventListener('click', function (event) {
            if (!nav.contains(event.target) && !menuButton.contains(event.target) && nav.classList.contains('menu-open')) {
                toggleNav(false);
            }
        });

        links.forEach(link => {
            const menu = link.nextElementSibling;
            if (!menu) return;

            link.addEventListener('click', function (event) {
                event.preventDefault();
                toggleMenu(link, menu);
            });

            link.addEventListener('keydown', function (event) {
                if (event.key === 'Enter' || event.key === ' ' || event.keyCode === 32) {
                    event.preventDefault();
                    toggleMenu(link, menu);
                }
            });
        });
    }

    function toggleMenu(link, menu, forceClose = null) {
        // Close all other submenus before opening a new one
        document.querySelectorAll('.quicklink-menu.open').forEach(openMenu => {
            if (openMenu !== menu) {
                const openLink = openMenu.previousElementSibling;
                if (openLink) {
                    openLink.setAttribute('aria-expanded', 'false');
                }
                openMenu.setAttribute('aria-hidden', 'true');
                openMenu.style.display = 'none';
                openMenu.classList.remove('open');
            }
        });
        const isExpanded = link.getAttribute('aria-expanded') === 'true';
        const shouldExpand = forceClose !== null ? !forceClose : !isExpanded;
        
        link.setAttribute('aria-expanded', shouldExpand.toString());
        menu.setAttribute('aria-hidden', (!shouldExpand).toString());
        menu.style.display = shouldExpand ? 'block' : 'none';
        
        const arrow = link.querySelector('.dropdown-arrow');
        if (arrow) {
            arrow.innerHTML = shouldExpand ? '\u25B2' : '\u25BC'; // Up arrow when expanded, down arrow when collapsed
        }

        if (shouldExpand) {
            menu.classList.add('open');
        } else {
            menu.classList.remove('open');
        }
    }

    document.addEventListener('DOMContentLoaded', initDropdown);
})();


$(document).ready(function () {
    $("[data-fancybox]").fancybox({
        keyboard: true, // Enable keyboard navigation
        focusTrap: true, // Keep focus inside the modal
        autoFocus: false, // Prevents forcing focus (better for accessibility)
        arrows: false, // Hide unnecessary navigation for a single modal
        closeExisting: true, // Close any open modals when opening a new one
        afterShow: function (instance, current) {
            $("#testimonial-modal").attr("aria-hidden", "false").focus();
        },
        beforeClose: function () {
            $("#testimonial-modal").attr("aria-hidden", "true");
        }
    });
});


$(document).ready(function() {
const selectors = `
a[target="_blank"],
a[rel$="external"],
a[href$=".pdf"],
a[href$=".doc"],
a[href$=".docx"],
a[href$=".ppt"],
a[href$=".pptx"],
a[href^="http:"]:not([href*="${window.location.host}"])
`;
$(selectors).each(function() {
$(this).attr('target', '_blank');
if ($(this).attr('title') && typeof $(this).attr('title') === 'string') {
$(this).append($('<span>').attr('class', 'screen-reader-text').append($(this).attr('title') + ' opens in new tab'));
} else {
$(this).append('<span class="screen-reader-text"> (opens in new tab) </span>');
}
});
});

document.addEventListener("DOMContentLoaded", function () {
    function updateAriaExpanded() {
        document.querySelectorAll('.vc_tta-panel').forEach(function (panel) {
            let toggleLink = panel.querySelector('.vc_tta-panel-title a'); // Target the clickable link
            if (toggleLink) {
                let isActive = panel.classList.contains('vc_active');
                toggleLink.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            }
        });
    }

    // Run on page load
    updateAriaExpanded();

    // Observe changes when accordion toggles
    const observer = new MutationObserver(updateAriaExpanded);
    document.querySelectorAll('.vc_tta-container').forEach((container) => {
        observer.observe(container, { attributes: true, subtree: true, attributeFilter: ['class'] });
    });
});

document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll("img[title]").forEach(img => img.removeAttribute("title"));
});

