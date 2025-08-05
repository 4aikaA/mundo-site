// Единый файл для всех анимаций и функциональности
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing animations...');
    
    // Инициализация GSAP
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        console.log('GSAP initialized');
    } else {
        console.error('GSAP not loaded');
        return;
    }

    // Анимация для h1.title (если элемент существует)
    var animElements = document.querySelectorAll(".anim");
    if (animElements.length > 0) {
        gsap.to(".anim", {
            duration: 0.5,
            opacity: 1,
            y: 0,
            stagger: 0.2,
            ease: "power2.out",
            delay: 0.8
        });
    }

    // Анимация для .advantages_item (если элемент существует)
    var advantagesElements = document.querySelectorAll(".advantages_item");
    if (advantagesElements.length > 0) {
        gsap.to(".advantages_item", {
            duration: 0.5,
            opacity: 1,
            y: 0,
            stagger: 0.2,
            ease: "power2.out",
            delay: 0.8
        });
    }

    // Анимация для advantage_tab_item
    gsap.utils.toArray('.advantage_tab_item').forEach(item => {
        gsap.from(item, {
            duration: .3,
            y: 30,
            opacity: 0,
            scrollTrigger: {
                trigger: item,
                start: "top bottom-=100",
                toggleActions: "play none none none"
            }
        });
    });

    // Функциональность для advantage_tab_item_info_block_title
    document.querySelectorAll('.advantage_tab_item_info_block_title').forEach(function(titleBlock, index) {
        const digit = titleBlock.closest('.advantage_tab_item').querySelector('.advantage_tab_item_digit');
        if (digit) {
            digit.textContent = String(index + 1).padStart(2, '0');
        }

        const infoBlock = titleBlock.nextElementSibling;
        if (infoBlock) {
            gsap.set(infoBlock, {
                height: 0,
                opacity: 0,
                marginTop: 0,
                overflow: 'hidden'
            });

            titleBlock.addEventListener('click', function() {
                const plusSign = titleBlock.querySelector('.advantage_tab_item_plus');

                if (infoBlock.style.height === '0px' || infoBlock.style.height === '') {
                    gsap.to(infoBlock, {
                        height: "auto",
                        opacity: 1,
                        marginTop: 10,
                        duration: 0.5,
                        ease: "power2.out"
                    });
                    if (plusSign) {
                        plusSign.textContent = '–';
                        plusSign.classList.add('advantage_tab_item_plus_active');
                    }
                } else {
                    gsap.to(infoBlock, {
                        height: 0,
                        opacity: 0,
                        marginTop: 0,
                        duration: 0.5,
                        ease: "power2.in"
                    });
                    if (plusSign) {
                        plusSign.textContent = '+';
                        plusSign.classList.remove('advantage_tab_item_plus_active');
                    }
                }
            });
        }
    });

    // Функциональность для steps_block_item_step
    var steps = document.querySelectorAll('.steps_block_item_step');
    steps.forEach(function(step) {
        step.addEventListener('click', function() {
            var tooltipId = this.getAttribute('data-tooltip-id');
            var tooltip = document.getElementById(tooltipId);

            var isTooltipAlreadyOpen = tooltip && tooltip.classList.contains('show_tooltip');

            document.querySelectorAll('.step_tooltip').forEach(function(tooltipEl) {
                tooltipEl.classList.remove('show_tooltip');
            });
            document.querySelectorAll('.advantage_tab_item_plus').forEach(function(plusEl) {
                plusEl.classList.remove('advantage_tab_item_plus_active');
            });

            if (!isTooltipAlreadyOpen && tooltip) {
                tooltip.classList.add('show_tooltip');
                var currentPlusElement = this.querySelector('.advantage_tab_item_plus');
                if (currentPlusElement) {
                    currentPlusElement.classList.add('advantage_tab_item_plus_active');
                }
            }
        });
    });

    // Функциональность для service-project
    var block = document.getElementById('service-project');
    if (block) {
        var title = document.getElementById('service-project-title');
        var list = block.querySelector('.services_block_item_info');
        var text = block.querySelector('.services_block_item_text');

        if (title && list && text) {
            function showText() {
                list.style.display = 'none';
                text.style.display = 'block';
            }
            function showList() {
                list.style.display = 'block';
                text.style.display = 'none';
            }

            title.addEventListener('mouseenter', showText);
            block.addEventListener('mouseleave', showList);
        }
    }

    // Горизонтальный скроллинг для services_block_container
    setTimeout(function() {
        var container = document.querySelector('.services_block_container');
        if (!container) {
            console.log('Services container not found');
            return;
        }
        
        console.log('Setting up horizontal scroll for services');
        
        var isMouseDown = false;
        var startX, scrollLeft;

        container.addEventListener('mousedown', function(e) {
            isMouseDown = true;
            container.style.cursor = 'grabbing';
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });

        container.addEventListener('mouseleave', function() {
            isMouseDown = false;
            container.style.cursor = 'grab';
        });

        container.addEventListener('mouseup', function() {
            isMouseDown = false;
            container.style.cursor = 'grab';
        });

        container.addEventListener('mousemove', function(e) {
            if (!isMouseDown) return;
            e.preventDefault();
            var x = e.pageX - container.offsetLeft;
            var walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;
        });

        container.style.cursor = 'grab';
        container.style.userSelect = 'none';
        
        // Функциональность стрелок для сервисов
        var prevBtn = document.querySelector('.services_block_prev');
        var nextBtn = document.querySelector('.services_block_next');
        
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', function() {
                var slideWidth = container.querySelector('.services_block_item').offsetWidth + 16;
                container.scrollBy({
                    left: -slideWidth,
                    behavior: 'smooth'
                });
            });
            
            nextBtn.addEventListener('click', function() {
                var slideWidth = container.querySelector('.services_block_item').offsetWidth + 16;
                container.scrollBy({
                    left: slideWidth,
                    behavior: 'smooth'
                });
            });
        }

        // Автоматическая смена плашек
        var slides = document.querySelectorAll('.services_block_item');
        var currentSlide = 0;
        var autoSlideInterval;
        var isHovered = false;

        if (slides.length > 0) {
            function nextSlide() {
                if (isHovered) return;
                
                currentSlide = (currentSlide + 1) % slides.length;
                var slideWidth = slides[0].offsetWidth + 16;
                var targetScroll = currentSlide * slideWidth;
                
                container.scrollTo({
                    left: targetScroll,
                    behavior: 'smooth'
                });
            }

            container.addEventListener('mouseenter', function() {
                isHovered = true;
                if (autoSlideInterval) {
                    clearInterval(autoSlideInterval);
                }
            });

            container.addEventListener('mouseleave', function() {
                isHovered = false;
                setTimeout(function() {
                    if (!isHovered) {
                        startAutoSlide();
                    }
                }, 1000);
            });

            function startAutoSlide() {
                if (autoSlideInterval) {
                    clearInterval(autoSlideInterval);
                }
                autoSlideInterval = setInterval(nextSlide, 3000);
            }

            setTimeout(startAutoSlide, 2000);
        }
    }, 100);

    // Автоматическая смена изображений из папки LOGO
    var logoImages = [
        'wp-content/themes/hvac/img/ЛогоВСЕ.png',
        'wp-content/themes/hvac/img/LOGO/FLIXX.png',
        'wp-content/themes/hvac/img/LOGO/Eckerle.png',
        'wp-content/themes/hvac/img/LOGO/Escelco.png',
        'wp-content/themes/hvac/img/LOGO/BYD.png',
        'wp-content/themes/hvac/img/LOGO/TAB.png',
        'wp-content/themes/hvac/img/LOGO/Huawei.png',
        'wp-content/themes/hvac/img/LOGO/Fronius.png',
        'wp-content/themes/hvac/img/LOGO/SMA.png',
        'wp-content/themes/hvac/img/LOGO/OEM.jpg',
        'wp-content/themes/hvac/img/LOGO/Victron Energy.png',
        'wp-content/themes/hvac/img/LOGO/Fox-ESS.png',
        'wp-content/themes/hvac/img/LOGO/TECH Controllers.png',
        'wp-content/themes/hvac/img/LOGO/Uponor.png',
        'wp-content/themes/hvac/img/LOGO/Risen.png',
        'wp-content/themes/hvac/img/LOGO/LUYMAR.png',
        'wp-content/themes/hvac/img/LOGO/INNOWATER.png',
        'wp-content/themes/hvac/img/LOGO/Holls.png',
        'wp-content/themes/hvac/img/LOGO/Hidros.png',
        'wp-content/themes/hvac/img/LOGO/pylontech.png',
        'wp-content/themes/hvac/img/LOGO/JASolar.png',
        'wp-content/themes/hvac/img/LOGO/JohnsonLogo.png',
        'wp-content/themes/hvac/img/LOGO/AldesLogo.png'
    ];

    var currentImageIndex = 0;
    var dhImage = document.querySelector('.about_block .dh');
    var dhmobImage = document.querySelector('.about_block .dhmob');
    var logoChangeInterval;

    if (dhImage && dhmobImage) {
        function changeLogoImage() {
            currentImageIndex = (currentImageIndex + 1) % logoImages.length;
            var newImageSrc = logoImages[currentImageIndex];
            
            dhImage.style.opacity = '0';
            dhmobImage.style.opacity = '0';
            
            setTimeout(function() {
                dhImage.src = newImageSrc;
                dhmobImage.src = newImageSrc;
                
                dhImage.style.opacity = '1';
                dhmobImage.style.opacity = '1';
            }, 300);
        }

        var style = document.createElement('style');
        style.textContent = `
            .about_block .dh,
            .about_block .dhmob {
                transition: opacity 0.3s ease;
            }
        `;
        document.head.appendChild(style);

        function startLogoChange() {
            if (logoChangeInterval) {
                clearInterval(logoChangeInterval);
            }
            
            if (currentImageIndex === 0) {
                logoChangeInterval = setTimeout(function() {
                    changeLogoImage();
                    logoChangeInterval = setInterval(changeLogoImage, 1500);
                }, 5000);
            } else {
                logoChangeInterval = setInterval(changeLogoImage, 1500);
            }
        }

        setTimeout(startLogoChange, 2000);
    }

    // Горизонтальный скролл для фото работ
    var workBlock = document.querySelector('.work_block');
    var workPrevBtn = document.querySelector('.work_block_prev');
    var workNextBtn = document.querySelector('.work_block_next');
    
    console.log('Work block found:', workBlock);
    console.log('Work prev button found:', workPrevBtn);
    console.log('Work next button found:', workNextBtn);
    
    if (workBlock) {
        var scrollAmount = 300;
        
        function scrollLeft() {
            console.log('Scrolling left');
            workBlock.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        }
        
        function scrollRight() {
            console.log('Scrolling right');
            workBlock.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
        
        if (workPrevBtn) {
            workPrevBtn.addEventListener('click', function() {
                console.log('Work prev button clicked');
                if (workPrevBtn.dataset.clickTimeout) return;
                workPrevBtn.dataset.clickTimeout = true;
                setTimeout(() => delete workPrevBtn.dataset.clickTimeout, 300);
                scrollLeft();
            });
        }
        
        if (workNextBtn) {
            workNextBtn.addEventListener('click', function() {
                console.log('Work next button clicked');
                if (workNextBtn.dataset.clickTimeout) return;
                workNextBtn.dataset.clickTimeout = true;
                setTimeout(() => delete workNextBtn.dataset.clickTimeout, 300);
                scrollRight();
            });
        }
        
        workBlock.addEventListener('wheel', function(e) {
            e.preventDefault();
            
            if (workBlock.dataset.wheelTimeout) {
                return;
            }
            
            workBlock.dataset.wheelTimeout = true;
            setTimeout(() => {
                delete workBlock.dataset.wheelTimeout;
            }, 300);
            
            if (e.deltaY > 0) {
                scrollRight();
            } else {
                scrollLeft();
            }
        });
    }

    // Плавная прокрутка к плашкам
    var dropdownLinks = document.querySelectorAll('.dropdown-menu a');
    
    dropdownLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var targetId = this.getAttribute('href');
            var targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                });
                
                setTimeout(function() {
                    targetElement.style.transform = 'scale(1.05)';
                    targetElement.style.boxShadow = '0 8px 25px rgba(12, 60, 140, 0.3)';
                    
                    setTimeout(function() {
                        targetElement.style.transform = 'scale(1)';
                        targetElement.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
                    }, 1000);
                }, 300);
            }
        });
    });

    // Функциональность стрелок для сервисов
    var servicesContainer = document.querySelector('.services_block_container');
    var servicesPrevBtn = document.querySelector('.services_block_prev');
    var servicesNextBtn = document.querySelector('.services_block_next');
    
    console.log('Services container found:', servicesContainer);
    console.log('Services prev button found:', servicesPrevBtn);
    console.log('Services next button found:', servicesNextBtn);
    
    if (servicesContainer && servicesPrevBtn && servicesNextBtn) {
        var scrollAmount = 300;
        
        function scrollServicesLeft() {
            console.log('Scrolling services left');
            servicesContainer.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        }
        
        function scrollServicesRight() {
            console.log('Scrolling services right');
            servicesContainer.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
        
        servicesPrevBtn.addEventListener('click', function() {
            console.log('Services prev button clicked');
            if (servicesPrevBtn.dataset.clickTimeout) return;
            servicesPrevBtn.dataset.clickTimeout = true;
            setTimeout(() => delete servicesPrevBtn.dataset.clickTimeout, 300);
            scrollServicesLeft();
        });
        
        servicesNextBtn.addEventListener('click', function() {
            console.log('Services next button clicked');
            if (servicesNextBtn.dataset.clickTimeout) return;
            servicesNextBtn.dataset.clickTimeout = true;
            setTimeout(() => delete servicesNextBtn.dataset.clickTimeout, 300);
            scrollServicesRight();
        });
    }

    console.log('All animations initialized');
});

// Анимация кругов при движении мыши
document.addEventListener("mousemove", function(e) {
    var mouseX = e.clientX;
    var mouseY = e.clientY;

    if (typeof gsap !== 'undefined') {
        gsap.to(".circle1", {
            duration: 0.5,
            x: (mouseX - window.innerWidth / 2) / 20,
            ease: "power2.out"
        });
        gsap.to(".circle2", {
            duration: 0.5,
            x: (mouseX - window.innerWidth / 2) / 30,
            ease: "power2.out"
        });
        gsap.to(".circle3", {
            duration: 0.5,
            x: (mouseX - window.innerWidth / 2) / 40,
            ease: "power2.out"
        });
    }
});

// Обработка текстовых узлов для неразрывных пробелов
document.addEventListener("DOMContentLoaded", function() {
    function handleTextNode(textNode) {
        const prepositions = ["в", "и", "на", "с", "к", "по", "о", "об", "от", "из", "у", "за", "над", "под",
            "перед", "при"
        ];
        const regex = new RegExp(`(\\s)(${prepositions.join("|")})(\\s)`, "gi");
        textNode.nodeValue = textNode.nodeValue.replace(regex, "$1$2\u00A0");
    }

    function processTextNodes(element) {
        const nodes = [];
        const treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);

        while (treeWalker.nextNode()) {
            nodes.push(treeWalker.currentNode);
        }

        nodes.forEach(handleTextNode);
    }

    const elements = document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, div");
    elements.forEach(processTextNodes);
}); 