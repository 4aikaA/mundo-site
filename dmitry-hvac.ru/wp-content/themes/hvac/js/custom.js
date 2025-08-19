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

    // Анимация для advantage_tab_item (если элементы существуют)
    var advantageTabItems = document.querySelectorAll('.advantage_tab_item');
    if (advantageTabItems.length > 0) {
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
    }

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
        var isTouching = false;
        var startX, scrollLeft;

        // Mouse events
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

                    // Touch events for mobile
            container.addEventListener('touchstart', function(e) {
                isTouching = true;
                startX = e.touches[0].pageX - container.offsetLeft;
                scrollLeft = container.scrollLeft;
                stopAutoSlide(); // Останавливаем автолистание при касании
            });

            container.addEventListener('touchend', function() {
                isTouching = false;
                // Возобновляем автолистание через 2 секунды после касания
                setTimeout(function() {
                    if (!isAutoSlideDisabled) {
                        startAutoSlide();
                    }
                }, 2000);
            });

            container.addEventListener('touchmove', function(e) {
                if (!isTouching) return;
                e.preventDefault();
                var x = e.touches[0].pageX - container.offsetLeft;
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
        var isAutoSlideDisabled = false;

        if (slides.length > 0) {
            function nextSlide() {
                if (isAutoSlideDisabled) {
                    return;
                }
                
                currentSlide = (currentSlide + 1) % slides.length;
                var slideWidth = slides[0].offsetWidth + 16;
                var targetScroll = currentSlide * slideWidth;
                
                container.scrollTo({
                    left: targetScroll,
                    behavior: 'smooth'
                });
            }

            function stopAutoSlide() {
                if (autoSlideInterval) {
                    clearInterval(autoSlideInterval);
                    autoSlideInterval = null;
                }
            }

            function startAutoSlide() {
                if (autoSlideInterval || isAutoSlideDisabled) return;
                autoSlideInterval = setInterval(nextSlide, 6000);
            }

            // Обработчик для контейнера
            container.addEventListener('mouseenter', function() {
                stopAutoSlide();
            });

            container.addEventListener('mouseleave', function() {
                setTimeout(function() {
                    if (!isAutoSlideDisabled) {
                        startAutoSlide();
                    }
                }, 1000);
            });

            // Отключаем автолистание при клике на стрелки
            if (prevBtn) {
                prevBtn.addEventListener('click', function() {
                    isAutoSlideDisabled = true;
                    stopAutoSlide();
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', function() {
                    isAutoSlideDisabled = true;
                    stopAutoSlide();
                });
            }

            // Запускаем автолистание через 2 секунды
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

    // Обработчик для кнопок "Заказать расчет"
    var orderButtons = document.querySelectorAll('.btnw, .btn');
    console.log('Найдено кнопок:', orderButtons.length);
    
    orderButtons.forEach(function(button) {
        console.log('Кнопка текст:', button.textContent.trim());
        if (button.textContent.trim() === 'Заказать расчет') {
            console.log('Добавляем обработчик для кнопки:', button);
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Создаем модальное окно с выбором способа связи
                var modal = document.createElement('div');
                modal.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10000;
                    backdrop-filter: blur(5px);
                `;
                
                var modalContent = document.createElement('div');
                modalContent.style.cssText = `
                    background: white;
                    padding: 40px;
                    border-radius: 20px;
                    max-width: 500px;
                    width: 90%;
                    text-align: center;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                `;
                
                modalContent.innerHTML = `
                    <h3 style="margin: 0 0 30px 0; color: #0C3C8C; font-size: 24px;">Выберите удобный способ связи:</h3>
                    
                    <div style="display: flex; flex-direction: column; gap: 15px;">
                        <a href="https://api.whatsapp.com/send/?phone=79216433297&text=%D0%9F%D1%80%D0%B8%D0%B2%D0%B5%D1%82.+%D0%9C%D0%B5%D0%BD%D1%8F+%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D0%B5%D1%81%D1%83%D0%B5%D1%82+%D0%B7%D0%B0%D0%BA%D0%B0%D0%B7+%D1%80%D0%B0%D1%81%D1%87%D0%B5%D1%82%D0%B0&type=phone_number&app_absent=0" 
                           target="_blank" rel="noopener noreferrer" 
                           style="display: flex; align-items: center; justify-content: center; gap: 15px; padding: 15px; background: #25D366; color: white; text-decoration: none; border-radius: 10px; font-weight: bold; transition: all 0.3s ease;">
                            <img src="wp-content/themes/hvac/img/whatsapp.svg" alt="WhatsApp" style="width: 24px; height: 24px;">
                            WhatsApp
                        </a>
                        
                        <a href="https://t.me/igor_kuznetsov1" 
                           target="_blank" rel="noopener noreferrer" 
                           style="display: flex; align-items: center; justify-content: center; gap: 15px; padding: 15px; background: #0088CC; color: white; text-decoration: none; border-radius: 10px; font-weight: bold; transition: all 0.3s ease;">
                            <img src="wp-content/themes/hvac/img/telegram-svgrepo-com.svg" alt="Telegram" style="width: 24px; height: 24px;">
                            Telegram Igor
                        </a>
                        
                        <a href="tel:+79216433297" 
                           style="display: flex; align-items: center; justify-content: center; gap: 15px; padding: 15px; background: #47C5AD; color: white; text-decoration: none; border-radius: 10px; font-weight: bold; transition: all 0.3s ease;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="width: 24px; height: 24px;">
                                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                            </svg>
                            +7 921 643-32-97
                        </a>
                        
                        <a href="#" onclick="copyEmail('igor.kuznetsov@gmail.com'); return false;" 
                           style="display: flex; align-items: center; justify-content: center; gap: 15px; padding: 15px; background: #0C3C8C; color: white; text-decoration: none; border-radius: 10px; font-weight: bold; transition: all 0.3s ease; cursor: pointer;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="width: 24px; height: 24px;">
                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                            </svg>
                            igor.kuznetsov@gmail.com
                        </a>
                    </div>
                    
                    <button onclick="this.closest('div[style*=\'position: fixed\']').remove()" 
                            style="margin-top: 30px; padding: 10px 20px; background: #f0f0f0; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; transition: all 0.3s ease;">
                        Закрыть
                    </button>
                `;
                
                modal.className = 'modal-overlay';
                modal.appendChild(modalContent);
                document.body.appendChild(modal);
                
                // Закрытие по клику вне модального окна
                modal.addEventListener('click', function(e) {
                    if (e.target === modal) {
                        modal.remove();
                    }
                });
                
                // Закрытие по Escape
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape' && document.body.contains(modal)) {
                        modal.remove();
                    }
                });
            });
        }
    });

    // Обработчик для старых popup кнопок (если они есть)
    var oldPopupButtons = document.querySelectorAll('.pop_up_form_btn a');
    oldPopupButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            var href = this.getAttribute('href');
            if (href && href !== '#') {
                window.open(href, '_blank');
            }
        });
    });

    // Функция для копирования email
    window.copyEmail = function(email) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(email).then(function() {
                showNotification('Email скопирован в буфер обмена!');
            }).catch(function(err) {
                console.error('Ошибка копирования: ', err);
                fallbackCopyTextToClipboard(email);
            });
        } else {
            fallbackCopyTextToClipboard(email);
        }
    };

    // Fallback для старых браузеров
    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showNotification('Email скопирован в буфер обмена!');
            }
        } catch (err) {
            console.error('Ошибка копирования: ', err);
        }
        
        document.body.removeChild(textArea);
    }

    // Функция для показа уведомления
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #47C5AD;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        
        // Добавляем CSS анимацию
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Удаляем уведомление через 3 секунды
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Функциональность для выделения кнопки "Выбрать услугу" при нажатии
    const servicesButtons = document.querySelectorAll('a[href="#services-anchor"]');
    const burgerServicesButton = document.querySelector('a[href="index.html"]'); // Кнопка в бургер-меню
    
    // Функция для выделения активной кнопки
    function highlightActiveButton() {
        // Убираем активный класс у всех кнопок меню
        document.querySelectorAll('.header-menu a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Проверяем текущий URL и выделяем соответствующую кнопку
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;
        
        console.log('Current path:', currentPath);
        console.log('Current hash:', currentHash);
        
        if (currentPath === '/' || currentPath === '/index.html' || currentPath.endsWith('/')) {
            // Если мы на главной странице
            console.log('На главной странице');
            if (currentHash === '#services-anchor') {
                // Если есть якорь на услуги, выделяем кнопку "Выбрать услугу"
                console.log('Выделяем кнопку "Выбрать услугу" (с якорем)');
                servicesButtons.forEach(button => button.classList.add('active'));
            } else if (currentHash === '#contact-info') {
                // Если есть якорь на контакты, выделяем кнопку "Контакты"
                console.log('Выделяем кнопку "Контакты"');
                const contactButtons = document.querySelectorAll('a[href="#contact-info"]');
                contactButtons.forEach(button => button.classList.add('active'));
            } else if (currentHash === '') {
                // Если на главной странице без якоря, выделяем кнопку "Выбрать услугу" по умолчанию
                console.log('Выделяем кнопку "Выбрать услугу" (по умолчанию)');
                servicesButtons.forEach(button => button.classList.add('active'));
            }
        } else if (currentPath.includes('/about/')) {
            // Если мы на странице "О себе"
            console.log('На странице "О себе"');
            const aboutButtons = document.querySelectorAll('a[href="about/index.html"], a[href="../about/index.html"]');
            aboutButtons.forEach(button => button.classList.add('active'));
        } else if (currentPath.includes('/primery-rabot/')) {
            // Если мы на странице "Примеры работ"
            console.log('На странице "Примеры работ"');
            const examplesButtons = document.querySelectorAll('a[href="primery-rabot/index.html"], a[href="../primery-rabot/index.html"]');
            examplesButtons.forEach(button => button.classList.add('active'));
        } else if (currentPath.includes('/konsultatsiya/')) {
            // Если мы на странице "Консультация"
            console.log('На странице "Консультация"');
            const consultationButtons = document.querySelectorAll('a[href="konsultatsiya/index.html"], a[href="../konsultatsiya/index.html"]');
            consultationButtons.forEach(button => button.classList.add('active'));
        }
        
        // Проверяем, если мы на главной странице и есть якорь на контакты
        if ((currentPath === '/' || currentPath === '/index.html' || currentPath.endsWith('/')) && currentHash === '#contact-info') {
            console.log('На главной странице, секция контакты');
            const contactButtons = document.querySelectorAll('a[href="#contact-info"]');
            contactButtons.forEach(button => button.classList.add('active'));
        }
        
        // Убираем дублирующую логику, так как кнопка "Выбрать услугу" уже выделяется выше
    }
    
    // Вызываем функцию при загрузке страницы
    highlightActiveButton();
    
    // Обработчики для кнопок
    servicesButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Убираем активный класс у всех кнопок меню
            document.querySelectorAll('.header-menu a').forEach(link => {
                link.classList.remove('active');
            });
            
            // Добавляем активный класс к нажатой кнопке
            this.classList.add('active');
        });
    });
    
    // Обработка для кнопки в бургер-меню
    if (burgerServicesButton) {
        burgerServicesButton.addEventListener('click', function(e) {
            // Убираем активный класс у всех кнопок меню
            document.querySelectorAll('.header-menu a').forEach(link => {
                link.classList.remove('active');
            });
            
            // Добавляем активный класс к нажатой кнопке
            this.classList.add('active');
        });
    }
    
    // Убираем дублирующиеся обработчики - оставляем только один общий обработчик для всех кнопок
    const menuButtons = document.querySelectorAll('.header-menu a');
    menuButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Убираем активный класс у всех кнопок меню
            document.querySelectorAll('.header-menu a').forEach(link => {
                link.classList.remove('active');
            });
            
            // Добавляем активный класс к нажатой кнопке
            this.classList.add('active');
        });
    });
    
    // Обработка изменения хэша (для якорных ссылок)
    window.addEventListener('hashchange', function() {
        const currentHash = window.location.hash;
        
        // Убираем активный класс у всех кнопок меню
        document.querySelectorAll('.header-menu a').forEach(link => {
            link.classList.remove('active');
        });
        
        if (currentHash === '#services-anchor') {
            // Если перешли к якорю услуг, выделяем кнопку "Выбрать услугу"
            console.log('Hash changed to services');
            servicesButtons.forEach(button => button.classList.add('active'));
        } else if (currentHash === '#contact-info') {
            // Если перешли к якорю контактов, выделяем кнопку "Контакты"
            console.log('Hash changed to contacts');
            const contactButtons = document.querySelectorAll('a[href="#contact-info"]');
            contactButtons.forEach(button => button.classList.add('active'));
        } else if (currentHash === '') {
            // Если нет якоря, выделяем кнопку "Выбрать услугу" по умолчанию
            console.log('Hash cleared, highlighting services by default');
            servicesButtons.forEach(button => button.classList.add('active'));
        }
    });

    console.log('All animations initialized');
});

// Анимация кругов при движении мыши (если элементы существуют)
// Временно отключено, так как элементы .circle1, .circle2, .circle3 отсутствуют в HTML
/*
document.addEventListener("mousemove", function(e) {
    // Проверяем существование элементов перед анимацией
    var circle1 = document.querySelector(".circle1");
    var circle2 = document.querySelector(".circle2");
    var circle3 = document.querySelector(".circle3");
    
    // Если элементов нет, не выполняем анимацию
    if (!circle1 && !circle2 && !circle3) {
        return;
    }
    
    var mouseX = e.clientX;
    var mouseY = e.clientY;

    if (typeof gsap !== 'undefined') {
        if (circle1) {
            gsap.to(".circle1", {
                duration: 0.5,
                x: (mouseX - window.innerWidth / 2) / 20,
                ease: "power2.out"
            });
        }
        if (circle2) {
            gsap.to(".circle2", {
                duration: 0.5,
                x: (mouseX - window.innerWidth / 2) / 30,
                ease: "power2.out"
            });
        }
        if (circle3) {
            gsap.to(".circle3", {
                duration: 0.5,
                x: (mouseX - window.innerWidth / 2) / 40,
                ease: "power2.out"
            });
        }
    }
});
*/

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