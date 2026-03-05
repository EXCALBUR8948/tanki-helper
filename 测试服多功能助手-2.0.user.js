// ==UserScript==
// @name         测试服多功能助手
// @version      2.0
// @description  自动转换 | 商店购买 | 开箱子 | 升级装备 | 购买道具 | 深色主题 | 聊天刷屏 | 注册彩蛋 | 按"H"键打开菜单
// @author       Testanki + WindowsX
// @match        https://tankionline.com/play*
// @match        https://*.tankionline.com/*
// @match        https://3dtank.com/play*
// @icon         https://img.icons8.com/?size=48&id=TuXN3JNUBGOT&format=png
// @grant        none
// ==/UserScript==
/*
使用说明：
1.自动转换：把坦克币转换为红宝石3
2.商店购买：购买最大值的物品
3.开箱子：容器开启器
4.升级装备：自动升级所有装备，无需手动切换
5.购买道具：自动购买一组道具
6.深色主题：美化包+暗黑滤镜
7.注册彩蛋：选择车辆的时候使用
8.聊天刷屏.自动发送信息
*/
(function() {
    'use strict';

    const style = document.createElement("style");
    style.innerHTML = `
    #windowsx-menu {
        position: fixed;
        width: 320px;
        background: linear-gradient(to bottom, #1e1e2f, #2e2e4d);
        color: white;
        font-family: Segoe UI, sans-serif;
        border: 1px solid #444;
        border-radius: 10px;
        box-shadow: 0 0 10px #000;
        z-index: 9999;
        user-select: none;
        display: none;
        transform: translate(-50%, -50%) scale(0.8);
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
        box-sizing: border-box;
        overflow: hidden;
        left: 50%;
        top: 50%;
        transform-origin: center center;
    }

    #windowsx-menu.visible {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
        display: block !important;
    }

    #windowsx-header {
        padding: 10px;
        background: linear-gradient(to right, #0078d7, #005a9e);
        font-weight: bold;
        font-size: 18px;
        text-align: center;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        cursor: move;
    }

    #windowsx-tabs {
        display: flex;
        justify-content: space-around;
        background-color: #1a1a2b;
        border-bottom: 1px solid #444;
    }

    .windowsx-tab {
        flex: 1;
        padding: 8px;
        text-align: center;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.3s;
        user-select: none;
    }

    .windowsx-tab:hover {
        background-color: #2a2a3d;
    }

    .windowsx-tab.active {
        background-color: #0078d7;
    }

    .windowsx-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 15px;
        border-top: 1px solid #444;
    }

    .windowsx-label {
        font-size: 15px;
    }

    .windowsx-toggle {
        width: 20px;
        height: 20px;
        border: 2px solid white;
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        background-color: #2e2e4d;
        user-select: none;
        transition: background-color 0.3s;
    }

    .windowsx-toggle.checked {
        background-color: #0078d7;
    }

    .windowsx-toggle.checked::after {
        content: "✓";
        color: white;
        font-size: 14px;
    }

    #lastupdateText {
        padding: 10px 15px;
        font-size: 14px;
        line-height: 1.4;
        display: none;
        max-height: 300px;
        overflow-y: auto;
    }

    #chatTab {
        display: none;
        padding: 10px 15px;
        font-size: 14px;
        box-sizing: border-box;
    }

    #spamStatus {
        margin-top: 10px;
        font-size: 14px;
        font-weight: bold;
        color: red;
    }

    #startSpamBtn, #stopSpamBtn {
        padding: 8px 20px;
        background-color: #0078d7;
        border: none;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        cursor: pointer;
        user-select: none;
        transition: background-color 0.3s;
    }

    #startSpamBtn:hover, #stopSpamBtn:hover {
        background-color: #005a9e;
    }

    #startSpamBtn:disabled, #stopSpamBtn:disabled {
        background-color: #555a7a;
        cursor: not-allowed;
    }
    `;
    document.head.appendChild(style);

    const menu = document.createElement("div");
    menu.id = "windowsx-menu";
    menu.innerHTML = `
    <div id="windowsx-header">测试服多功能助手 🥴</div>
    <div id="windowsx-tabs">
        <div class="windowsx-tab active" data-tab="main">主要</div>
        <div class="windowsx-tab" data-tab="chat">聊天刷屏</div>
        <div class="windowsx-tab" data-tab="lastupdate">最近更新</div>
    </div>

    <div id="mainTab">
        <div class="windowsx-item">
            <span class="windowsx-label">自动转换</span>
            <div class="windowsx-toggle" data-name="autoConversion"></div>
        </div>
        <div class="windowsx-item">
            <span class="windowsx-label">商店购买</span>
            <div class="windowsx-toggle" data-name="smartShop"></div>
        </div>
        <div class="windowsx-item">
            <span class="windowsx-label">开箱子</span>
            <div class="windowsx-toggle" data-name="openContainers"></div>
        </div>
        <div class="windowsx-item">
            <span class="windowsx-label">升级装备</span>
            <div class="windowsx-toggle" data-name="smartUpgrade"></div>
        </div>
        <div class="windowsx-item">
            <span class="windowsx-label">购买道具</span>
            <div class="windowsx-toggle" data-name="buyProps"></div>
        </div>
        <div class="windowsx-item">
            <span class="windowsx-label">深色主题</span>
            <div class="windowsx-toggle" data-name="tankDarkTheme"></div>
        </div>
        <div class="windowsx-item">
            <span class="windowsx-label">注册彩蛋</span>
            <div class="windowsx-toggle" data-name="easterEgg"></div>
        </div>
    </div>

    <div id="chatTab" style="display: none;">
        <div style="display: flex; flex-direction: column; gap: 10px;">
            <textarea id="spamMessagesInput" rows="4" style="resize: none; width: 100%;" placeholder="输入刷屏消息，用 / 分隔..."></textarea>
            <div style="display: flex; gap: 10px;">
                <button id="startSpamBtn">开始</button>
                <button id="stopSpamBtn">停止</button>
            </div>
            <div id="spamStatus" style="margin-top: 10px; color: red;">刷屏: 未激活</div>
        </div>
    </div>

    <div id="lastupdateText" style="display: none;">
        <p><strong>测试服多功能助手 2.0 更新日志:</strong></p>
        <p>– 脑残原作者，不会写别写</p>
        <p>– 快捷键 H 键</p>
    </div>
    `;
    document.body.appendChild(menu);

    const tabs = menu.querySelectorAll(".windowsx-tab");
    const mainTab = menu.querySelector("#mainTab");
    const chatTab = menu.querySelector("#chatTab");
    const lastupdateText = menu.querySelector("#lastupdateText");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            const selected = tab.getAttribute("data-tab");
            mainTab.style.display = selected === "main" ? "block" : "none";
            chatTab.style.display = selected === "chat" ? "block" : "none";
            lastupdateText.style.display = selected === "lastupdate" ? "block" : "none";
        });
    });

    const State = {
        autoConversion: false,
        smartShop: false,
        openContainers: false,
        smartUpgrade: false,
        buyProps: false,
        tankDarkTheme: false,
        easterEgg: false,

        autoConversionObserver: null,
        smartShopObserver: null,
        openContainersInterval: null,
        smartUpgradeFrameId: null,
        buyPropsFrameId: null,
        spamInterval: null,

        isSpammingOpenContainers: false,
        openContainersStopTimeout: null,
        shopWaitingForPopup: false,

        upgradeCheckedCategories: new Set(),
        upgradeWaitingForLoad: false,
        upgradeExpectedCategoryIndex: -1,
        upgradeOldFirstItemName: "",

        spamMessages: [],
        spamIndex: 0,
        eggTriggered: false,
        lastAutoClickTime: 0
    };

    function simulateClick(el) {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        ['mousedown', 'mouseup', 'click'].forEach(type => {
            el.dispatchEvent(new MouseEvent(type, {
                bubbles: true,
                clientX: rect.left + rect.width / 2,
                clientY: rect.top + rect.height / 2
            }));
        });
    }

    function simulateKeyPress(key) {
        ['keydown', 'keyup'].forEach(type => {
            document.dispatchEvent(new KeyboardEvent(type, {
                key: key,
                code: key,
                keyCode: key.charCodeAt(0),
                bubbles: true
            }));
        });
    }

    function simulateEscape() {
        const eventOptions = {
            key: 'Escape',
            code: 'Escape',
            keyCode: 27,
            which: 27,
            bubbles: true,
            cancelable: true,
            composed: true,
            view: window
        };
        document.dispatchEvent(new KeyboardEvent('keydown', eventOptions));
        document.dispatchEvent(new KeyboardEvent('keyup', eventOptions));
    }

    function getElementByPartialClass(partial) {
        const els = document.querySelectorAll('*');
        for (let el of els) if (el.className.includes(partial)) return el;
        return null;
    }

    function findButtonByTexts(tag, texts, partialClass) {
        const elements = document.querySelectorAll(tag);
        for (const el of elements) {
            const txt = el.textContent.trim();
            if (texts.includes(txt)) {
                const button = el.closest(`div[class*="${partialClass}"]`);
                if (button) return button;
            }
        }
        return null;
    }

    function clickIfFound(button) {
        if (button) {
            button.click();
            return true;
        }
        return false;
    }

    function clickButtonByColor(targetColorRgb) {
        const divs = document.getElementsByTagName('div');
        for (let i = divs.length - 1; i >= 0; i--) {
            const div = divs[i];
            if (!div.className || div.offsetWidth <= 0) continue;
            const style = window.getComputedStyle(div);
            if (style.backgroundColor.replace(/\s/g, '') === targetColorRgb.replace(/\s/g, '')) {
                div.click();
                return true;
            }
        }
        return false;
    }

    function startAutoConversion() {
        State.autoConversion = true;
        if (!State.autoConversionObserver) {
            State.autoConversionObserver = new MutationObserver(() => {
                if (State.autoConversion) autoConversionLogic();
            });
            State.autoConversionObserver.observe(document.body, { childList: true, subtree: true });
        }
        autoConversionLogic();
    }

    function stopAutoConversion() {
        State.autoConversion = false;
        if (State.autoConversionObserver) {
            State.autoConversionObserver.disconnect();
            State.autoConversionObserver = null;
        }
    }

    function autoConversionLogic() {
        const balanceText = document.querySelector('.ConverterDialogComponentStyle-coinBalanceText');
        if (balanceText && balanceText.innerText.trim() === '0') {
            const closeIcon = document.querySelector('.ConverterDialogComponentStyle-closeIcon');
            if (closeIcon) closeIcon.click();
            return;
        }
        if (clickButtonByColor('rgb(118, 255, 51)')) return;
        const maxIcon = document.querySelector('img[src*="max.2f636a21.svg"]');
        if (maxIcon && maxIcon.parentElement) {
            maxIcon.parentElement.click();
            clickButtonByColor('rgb(255, 204, 0)');
            return;
        }
        const rubyIcon = document.querySelector('img[src*="addRuby.ff47c8be.svg"]');
        if (rubyIcon && rubyIcon.parentElement) rubyIcon.parentElement.click();
    }

    function startSmartShop() {
        State.shopWaitingForPopup = false;
        if (!State.smartShopObserver) {
            State.smartShopObserver = new MutationObserver(() => {
                if (State.smartShop) smartShopLogic();
            });
            State.smartShopObserver.observe(document.body, { childList: true, subtree: true });
        }
        smartShopLogic();
    }

    function stopSmartShop() {
        if (State.smartShopObserver) {
            State.smartShopObserver.disconnect();
            State.smartShopObserver = null;
        }
    }

    function smartShopLogic() {
        const redBtn = findRedButton();
        if (redBtn) {
            redBtn.click();
            State.shopWaitingForPopup = true;
            return;
        }
        if (!redBtn) {
            const anyDialog = document.querySelector('.BasePaymentComponentStyle-buttonContainer');
            if (State.shopWaitingForPopup === true) {
                if (!anyDialog) State.shopWaitingForPopup = false;
            }
            if (State.shopWaitingForPopup === false) {
                const items = document.querySelectorAll('.shop-item-component');
                if (items.length > 0) {
                    items[items.length - 1].click();
                    State.shopWaitingForPopup = true;
                }
            }
        }
    }

    function findRedButton() {
        const container = document.querySelector('.BasePaymentComponentStyle-buttonContainer');
        if (container) {
            return container.querySelector('div') || container;
        }
        return null;
    }

    function findOpenMoreButton() {
        const targetTexts = ['打开更多', '开启更多', 'OPEN MORE', 'Открыть ещё'];
        const spans = document.querySelectorAll('span');
        for (let span of spans) {
            const text = span.textContent.trim().toUpperCase();
            if (targetTexts.some(target => text === target.toUpperCase())) {
                let container = span.closest('div');
                while (container) {
                    if (container.className.includes('ClosedContainerStyle') || container.className.includes('ksc-')) {
                        return container;
                    }
                    container = container.parentElement;
                }
            }
        }
        return null;
    }

    function spamClick(target) {
        if (!State.isSpammingOpenContainers || !target) return;
        for (let i = 0; i < 10000; i++) {
            try {
                target.click();
            } catch {
                break;
            }
        }
    }

    function openContainersLoop() {
        if (!State.isSpammingOpenContainers) return;
        const button = findOpenMoreButton();
        if (button) spamClick(button);
        requestAnimationFrame(openContainersLoop);
    }

    function startOpenContainers() {
        if (State.isSpammingOpenContainers) return;
        State.isSpammingOpenContainers = true;
        openContainersLoop();
    }

    function stopOpenContainers() {
        State.isSpammingOpenContainers = false;
        if (State.openContainersStopTimeout) {
            clearTimeout(State.openContainersStopTimeout);
            State.openContainersStopTimeout = null;
        }
    }

    const MAX_CATEGORIES_TO_CHECK = 5;
    const TARGET_COLORS = ['rgb(0, 212, 255)', 'rgb(255, 102, 102)'];

    function startSmartUpgrade() {
        State.upgradeCheckedCategories.clear();
        State.upgradeWaitingForLoad = false;
        State.upgradeOldFirstItemName = "";
        smartUpgradeLoop();
    }

    function stopSmartUpgrade() {
        if (State.smartUpgradeFrameId) {
            cancelAnimationFrame(State.smartUpgradeFrameId);
            State.smartUpgradeFrameId = null;
        }
    }

    function triggerUpgradeClick(element) {
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const x = rect.left + (rect.width / 2);
        const y = rect.top + (rect.height / 2);
        const eventConfig = {
            view: window, bubbles: true, cancelable: true, buttons: 1,
            clientX: x, clientY: y, screenX: x, screenY: y, pointerId: 1, isPrimary: true
        };
        ['pointerover', 'pointerenter', 'pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(type => {
            const cls = (type.startsWith('pointer')) ? PointerEvent : MouseEvent;
            try {
                element.dispatchEvent(new cls(type, eventConfig));
            } catch (e) {}
        });
    }

    function isValidTargetItem(item) {
        if (!item) return false;
        if (item.querySelector('.GarageItemComponentStyle-unavailable')) return false;
        const text = item.innerText.toUpperCase();
        if (text.includes("?")) return false;
        if (text.includes("MAX")) return false;
        return true;
    }

    function findCurrentSelectedItem() {
        const items = document.querySelectorAll('.garage-item');
        for (let item of items) {
            const style = window.getComputedStyle(item);
            if (style.boxShadow.includes('rgb(255, 255, 255)')) {
                return item;
            }
        }
        return null;
    }

    function smartUpgradeLoop() {
        if (!State.smartUpgrade) return;

        if (State.upgradeWaitingForLoad) {
            const menuItems = document.querySelectorAll('.MenuComponentStyle-mainMenuItem');
            const garageItems = document.querySelectorAll('.garage-item');
            const currentFirstItemName = garageItems.length > 0 ? garageItems[0].innerText : "EMPTY";
            const isMenuReady = menuItems[State.upgradeExpectedCategoryIndex] && menuItems[State.upgradeExpectedCategoryIndex].classList.contains('Common-activeMenu');
            const isContentChanged = (currentFirstItemName !== State.upgradeOldFirstItemName);
            if (isMenuReady && garageItems.length > 0 && isContentChanged) {
                State.upgradeWaitingForLoad = false;
            } else {
                State.smartUpgradeFrameId = requestAnimationFrame(smartUpgradeLoop);
                return;
            }
        }

        const greenBtn = document.querySelector('.DialogContainerComponentStyle-enterButton');
        const modalRoot = document.querySelector('#modal-root');
        const isModalOpen = modalRoot && modalRoot.childElementCount > 0 && modalRoot.querySelector('.ModalStyle-rootHover');
        const upgradeContainer = document.querySelector('.TanksPartBaseComponentStyle-buttonsContainer');
        const targetBtn = upgradeContainer ? upgradeContainer.querySelector('.MountedItemsComponentStyleMobile-commonButtonUpdate') : null;
        const buyIcon = document.querySelector('div[style*="buyButtonIcon"]');

        if (isModalOpen || greenBtn) {
            if (greenBtn && greenBtn.dataset.tmClicked !== "true") {
                greenBtn.dataset.tmClicked = "true";
                triggerUpgradeClick(greenBtn);
            }
            State.smartUpgradeFrameId = requestAnimationFrame(smartUpgradeLoop);
            return;
        }

        if (buyIcon) {
            findAndSwitchItem(findCurrentSelectedItem());
            State.smartUpgradeFrameId = requestAnimationFrame(smartUpgradeLoop);
            return;
        }

        if (targetBtn) {
            const computedStyle = window.getComputedStyle(targetBtn);
            const currentColor = computedStyle.backgroundColor;
            const isMainButtonActive = TARGET_COLORS.some(c => c === currentColor);
            if (isMainButtonActive) {
                if (targetBtn.dataset.lastColor !== currentColor) {
                    targetBtn.dataset.lastColor = currentColor;
                    triggerUpgradeClick(targetBtn);
                }
            } else {
                if (targetBtn.dataset.lastColor) delete targetBtn.dataset.lastColor;
                checkCurrentAndSwitch();
            }
        } else {
            checkCurrentAndSwitch();
        }

        State.smartUpgradeFrameId = requestAnimationFrame(smartUpgradeLoop);
    }

    function checkCurrentAndSwitch() {
        const currentItem = findCurrentSelectedItem();
        if (currentItem) {
            if (isValidTargetItem(currentItem)) {
            } else {
                findAndSwitchItem(currentItem);
            }
        } else {
            findAndSwitchItem();
        }
    }

    function findAndSwitchItem(currentItemToIgnore) {
        const items = document.querySelectorAll('.garage-item');
        for (let item of items) {
            if (item === currentItemToIgnore) continue;
            if (isValidTargetItem(item)) {
                triggerUpgradeClick(item);
                const img = item.querySelector('.GarageItemComponentStyle-mainImg');
                if (img) triggerUpgradeClick(img);
                const txt = item.querySelector('.GarageItemComponentStyle-descriptionDevice');
                if (txt) triggerUpgradeClick(txt);
                return;
            }
        }
        switchCategory();
    }

    function switchCategory() {
        const menuItems = Array.from(document.querySelectorAll('.MenuComponentStyle-mainMenuItem'));
        const targetMenuItems = menuItems.slice(0, MAX_CATEGORIES_TO_CHECK);
        const activeIndex = targetMenuItems.findIndex(el => el.classList.contains('Common-activeMenu'));
        if (activeIndex !== -1) State.upgradeCheckedCategories.add(activeIndex);

        let targetIndex = -1;
        for (let i = 0; i < MAX_CATEGORIES_TO_CHECK; i++) {
            if (!State.upgradeCheckedCategories.has(i)) {
                targetIndex = i;
                break;
            }
        }

        if (targetIndex !== -1) {
            const nextMenuEl = targetMenuItems[targetIndex];
            const currentGarageItems = document.querySelectorAll('.garage-item');
            State.upgradeOldFirstItemName = currentGarageItems.length > 0 ? currentGarageItems[0].innerText : "EMPTY";
            triggerUpgradeClick(nextMenuEl);
            State.upgradeWaitingForLoad = true;
            State.upgradeExpectedCategoryIndex = targetIndex;
        }
    }

    function startBuyProps() {
        buyPropsLoop();
    }

    function stopBuyProps() {
        if (State.buyPropsFrameId) {
            cancelAnimationFrame(State.buyPropsFrameId);
            State.buyPropsFrameId = null;
        }
    }

    function buyPropsLoop() {
        if (!State.buyProps) return;
        buyPropsLogic();
        State.buyPropsFrameId = requestAnimationFrame(buyPropsLoop);
    }

    function buyPropsLogic() {
        const cards = document.querySelectorAll('div[class*="SaleByKitStyle-commonCard"]');
        if (cards && cards.length > 0) {
            const lastCardWrapper = cards[cards.length - 1];
            if (lastCardWrapper) {
                const clickableInner = lastCardWrapper.querySelector('div[class*="SaleByKitStyle-card"]:not([style*="opacity: 0"])');
                (clickableInner || lastCardWrapper).click();
                const closeBtn = document.querySelector('div[class*="DialogContainerComponentStyle-imgClose"]');
                if (closeBtn) closeBtn.click();
                return;
            }
        }
        const garageContainer = document.querySelector('div[class*="GarageSuppliesComponentStyle-containerButtons"]');
        if (garageContainer) {
            const buttons = garageContainer.querySelectorAll('div');
            for (let i = buttons.length - 1; i >= 0; i--) {
                const btn = buttons[i];
                if (btn.offsetWidth > 0) { btn.click(); return; }
            }
        }
    }

    function triggerEasterEgg() {
        if (State.eggTriggered) return;
        State.eggTriggered = true;

        const sequence = [
            { code: 'ArrowUp', key: 'ArrowUp', keyCode: 38 },
            { code: 'ArrowUp', key: 'ArrowUp', keyCode: 38 },
            { code: 'ArrowDown', key: 'ArrowDown', keyCode: 40 },
            { code: 'ArrowDown', key: 'ArrowDown', keyCode: 40 },
            { code: 'ArrowLeft', key: 'ArrowLeft', keyCode: 37 },
            { code: 'ArrowRight', key: 'ArrowRight', keyCode: 39 },
            { code: 'ArrowLeft', key: 'ArrowLeft', keyCode: 37 },
            { code: 'ArrowRight', key: 'ArrowRight', keyCode: 39 },
            { code: 'KeyB', key: 'b', keyCode: 66 },
            { code: 'KeyA', key: 'a', keyCode: 65 }
        ];

        sequence.forEach(k => {
            document.dispatchEvent(new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                key: k.key,
                code: k.code,
                keyCode: k.keyCode,
                which: k.keyCode,
                view: window
            }));
            document.dispatchEvent(new KeyboardEvent('keyup', {
                bubbles: true,
                cancelable: true,
                key: k.key,
                code: k.code,
                keyCode: k.keyCode,
                which: k.keyCode,
                view: window
            }));
        });
        console.log("Konami Code Triggered!");

        setTimeout(() => {
            State.eggTriggered = false;
        }, 5000);
    }

    const spamMessagesInput = menu.querySelector('#spamMessagesInput');
    const startSpamBtn = menu.querySelector('#startSpamBtn');
    const stopSpamBtn = menu.querySelector('#stopSpamBtn');
    const spamStatus = menu.querySelector('#spamStatus');

    const textarea = document.getElementById('spamMessagesInput');
    textarea.addEventListener('keydown', e => e.stopPropagation());
    textarea.addEventListener('keypress', e => e.stopPropagation());
    textarea.addEventListener('keyup', e => e.stopPropagation());
    textarea.addEventListener('mousedown', e => e.stopPropagation());
    textarea.addEventListener('click', e => e.stopPropagation());

    function findChatInput() {
        let input = document.querySelector('input.BattleChatComponentStyle-publicMessageColor');
        if (!input || input.offsetParent === null) {
            input = document.querySelector('input.BattleChatComponentStyle-blueTeamColor');
        }
        if (input && input.offsetParent !== null) return input;
        return null;
    }

    function sendMessage(message) {
        const input = findChatInput();
        if (!input) {
            ['keydown', 'keypress', 'keyup'].forEach(type => {
                const e = new KeyboardEvent(type, { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true });
                document.dispatchEvent(e);
            });
            return false;
        }

        input.focus();
        input.value = message;
        input.dispatchEvent(new InputEvent('input', { bubbles: true }));

        ['keydown', 'keypress', 'keyup'].forEach(type => {
            const e = new KeyboardEvent(type, { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true });
            input.dispatchEvent(e);
        });
        return true;
    }

    function startSpam() {
        if (State.spamInterval) return;

        const raw = spamMessagesInput.value.trim();
        if (!raw) {
            alert('请输入刷屏消息，用"/"分隔');
            return;
        }
        State.spamMessages = raw.split('/').map(m => m.trim()).filter(m => m.length > 0);
        if (State.spamMessages.length === 0) {
            alert('请输入有效的刷屏消息');
            return;
        }

        State.spamIndex = 0;
        spamStatus.textContent = '刷屏: 激活';
        spamStatus.style.color = 'limegreen';
        startSpamBtn.disabled = true;
        stopSpamBtn.disabled = false;

        State.spamInterval = setInterval(() => {
            const sent = sendMessage(State.spamMessages[State.spamIndex]);
            if (sent) {
                State.spamIndex = (State.spamIndex + 1) % State.spamMessages.length;
            }
        }, 1087);
    }

    function stopSpam() {
        if (!State.spamInterval) return;
        clearInterval(State.spamInterval);
        State.spamInterval = null;
        spamStatus.textContent = '刷屏: 未激活';
        spamStatus.style.color = 'red';
        startSpamBtn.disabled = false;
        stopSpamBtn.disabled = true;
    }

    startSpamBtn.addEventListener('click', startSpam);
    stopSpamBtn.addEventListener('click', stopSpam);
    stopSpamBtn.disabled = true;

    function updateFeature(name, enabled) {
        State[name] = enabled;

        switch(name) {
            case 'autoConversion':
                if (enabled) startAutoConversion();
                else stopAutoConversion();
                break;
            case 'smartShop':
                if (enabled) startSmartShop();
                else stopSmartShop();
                break;
            case 'openContainers':
                if (enabled) startOpenContainers();
                else stopOpenContainers();
                break;
            case 'smartUpgrade':
                if (enabled) startSmartUpgrade();
                else stopSmartUpgrade();
                break;
            case 'buyProps':
                if (enabled) startBuyProps();
                else stopBuyProps();
                break;
            case 'tankDarkTheme':
                const existingStyle = document.getElementById('tank-dark-theme-style');
                if (enabled) {
                    if (!existingStyle) {
                        const style = document.createElement("style");
                        style.id = 'tank-dark-theme-style';
                        style.innerText = tankDarkThemeCSS;
                        document.head.appendChild(style);
                    }
                } else {
                    if (existingStyle) existingStyle.remove();
                }
                break;
            case 'easterEgg':
                if (enabled) {
                    triggerEasterEgg();
                    setTimeout(() => {
                        const toggle = document.querySelector('.windowsx-toggle[data-name="easterEgg"]');
                        if (toggle) {
                            toggle.classList.remove('checked');
                            State.easterEgg = false;
                        }
                    }, 1000);
                }
                break;
        }
    }

    menu.querySelectorAll('.windowsx-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const name = toggle.getAttribute('data-name');
            const enabled = !toggle.classList.contains('checked');
            toggle.classList.toggle('checked', enabled);
            updateFeature(name, enabled);
        });
    });

    let visible = false;
    const menuEl = document.getElementById('windowsx-menu');

    function showMenu() {
        menuEl.style.display = 'block';
        setTimeout(() => {
            menuEl.classList.add('visible');
        }, 10);
        visible = true;
    }

    function hideMenu() {
        menuEl.classList.remove('visible');
        setTimeout(() => {
            if (!visible) menuEl.style.display = 'none';
        }, 500);
        visible = false;
    }

    function toggleMenu() {
        if (visible) hideMenu();
        else showMenu();
    }

    document.addEventListener('keydown', e => {
        if (e.key === 'h') {
            e.preventDefault();
            toggleMenu();
        }
    });

    let drag = false, offsetX = 0, offsetY = 0;
    const header = document.getElementById('windowsx-header');

    header.addEventListener('mousedown', e => {
        drag = true;
        offsetX = e.clientX - menuEl.offsetLeft;
        offsetY = e.clientY - menuEl.offsetTop;
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mouseup', () => {
        drag = false;
        document.body.style.userSelect = '';
    });

    document.addEventListener('mousemove', e => {
        if (!drag) return;
        let left = e.clientX - offsetX;
        let top = e.clientY - offsetY;

        if (left < 0) left = 0;
        if (top < 0) top = 0;
        if (left + menuEl.offsetWidth > window.innerWidth) left = window.innerWidth - menuEl.offsetWidth;
        if (top + menuEl.offsetHeight > window.innerHeight) top = window.innerHeight - menuEl.offsetHeight;

        menuEl.style.left = left + 'px';
        menuEl.style.top = top + 'px';
        menuEl.style.transform = 'scale(1)';
    });

  var tankDarkThemeCSS = `.WelcomeMessage{position:absolute;left:50%;transform:translate(-50%,-50%);top:13%;transition:top 2s ease;background-color:rgb(0 0 0 /50%);border-radius:12px;color:white;padding:12px;z-index:9999}.DialogContainerComponentStyle-container{background:rgb(0 0 0/40%);border-radius:20px;border:2px solid rgba(255,255,255,0.19);opacity:0;animation:kss 0.7s forwards}@keyframes kss{0%{opacity:0}100%{opacity:1}}.LobbyLoaderComponentStyle-container{background:rgb(0 0 0/65%);backdrop-filter:blur(8px)}.Common-container{background:rgb(0 0 0/30%)}.ChatComponentStyle-chatWindow{background:rgb(12 12 12/50%);backdrop-filter:blur(5px);opacity:0;animation:zkZz 0.7s forwards}@keyframes zkZz{0%{opacity:0}100%{opacity:1}}.ContextMenuStyle-menu{background:rgb(0 0 0/37%);border:1px solid rgba(255,255,255,0.25);border-radius:15px}html{filter:saturate(130%) contrast(110%) brightness(96%) !important}.Common-changingBackground,.ApplicationLoaderComponentStyle.Common-background{filter:brightness(0.7)}.ModalStyle-rootHover{z-index:99999;background:rgb(0 0 0/29%);backdrop-filter:blur(5px)}.SettingsComponentStyle-scrollingMenu{opacity:0;animation:csttt 0.9s forwards}@keyframes csttt{0%{opacity:0}100%{opacity:1}}.InputRangeComponentStyle-range{background:rgb(0 0 0/60%);border-radius:10px;border:2px solid rgba(255,255,255,0.23)}.InputRangeComponentStyle-range::-webkit-slider-thumb{background:rgb(255 255 255/80%);border-radius:50px}.LobbyLoaderComponentStyle-logo{filter:brightness(0%);filter:hue-rotate(180deg)}.LobbyLoaderComponentStyle-logo{animation:ani 2s linear forwards;animation-iteration-count:2}@keyframes ani{0%{width:0}100%{width:100px}}.Common-menuItemActive{color:rgb(255,188,9)}.Common-flexStartAlignCenter.Common-flexWrapNowrap.modeLimitIcon{background:rgb(0 0 0/20%);backdrop-filter:blur(5px);border-radius:10px;border:1px solid rgba(255,255,255,0.3);transition:box-shadow 0.6s !important;box-shadow:unset !important;opacity:0;animation:stsa 0.7s forwards}@keyframes stsa{0%{opacity:0}100%{opacity:1}}.Common-flexStartAlignCenter.Common-flexWrapNowrap.modeLimitIcon:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.08em !important}.UsersTableStyle-cellName.UsersTableStyle-rowBattleEmpty.UsersTableStyle-centerCell.UsersTableStyle-fontCell{background-color:rgba(0,0,0,0.5);border:2px solid rgba(0,0,255,0.23);border-radius:12px;margin:2px}.BattleTabStatisticComponentStyle-selectedRowBackGround{background-color:transparent;transition:box-shadow 0.5s !important;box-shadow:unset !important}.BattleTabStatisticComponentStyle-selectedRowBackGround:hover{box-shadow:rgb(51,187,255) 0em 0em 0em 2px !important}.UsersTableStyle-cellName.UsersTableStyle-rowBattleEmpty.UsersTableStyle-centerCell.UsersTableStyle-fontCell{background:rgba(0,0,0,0.5);border:2px solid rgba(255,255,255,0.23);border-radius:12px;margin:2px}.BattleTabStatisticComponentStyle-rowBackGround{background-color:rgb(0 0 255 / 0%);border-radius:10px;border:none}.UsersTableStyle-cellName.UsersTableStyle-centerCell.UsersTableStyle-fontCell.UsersTableStyle-rowBattle{background-color:rgba(0,0,0,0.1);border:2px solid rgba(255,255,255,0.2);border-radius:12px;margin:2px;backdrop-filter:blur(3px)}.UsersTableStyle-cellNameDM.UsersTableStyle-fontCell{background-color:rgba(0,0,0,0.5);border:2px solid rgba(255,255,255,0.23);border-radius:12px;margin:2px}.UsersTableStyle-cellName.UsersTableStyle-centerCell.UsersTableStyle-fontCell.UsersTableStyle-rowBattle{background-color:rgba(0,0,0,0.1);border:2px solid rgba(255,255,255,0.23);border-radius:10px;margin:2px;backdrop-filter:blur(3px)}.BreadcrumbsComponentStyle-headerContainer{border-bottom-left-radius:30px;border-bottom-right-radius:30px;border:2px solid rgba(255,255,255,0.2)}.BattleTabStatisticComponentStyle-containerInsideTeams{background:rgb(0 0 0 / 20%);backdrop-filter:blur(15px);border:2px solid rgba(255,255,255,0.19);border-radius:15px}@keyframes zVzVv{0%{opacity:0}100%{opacity:1}}@keyframes fadeOut{0%{opacity:0}100%{opacity:1}}.BattleTabStatisticComponentStyle-containerInsideResults{background:rgb(0 0 0/33%);backdrop-filter:blur(4px);border:2px solid rgba(255,255,255,0.19);border-radius:15px}@keyframes zVzV{0%{opacity:0}100%{opacity:1}}.UsersTableStyle-row{background:transparent}.BattleTabStatisticComponentStyle-selectedRowBackGround{background:rgb(130 130 130 / 20%);border:1px solid rgba(255,255,255,0.3);border-radius:12px}.BattleTabStatisticComponentStyle-rowBackGround{background-color:rgb(0 0 0 / 20%);border:1px solid rgba(255,255,255,0.3);border-radius:12px}.BattlePassLobbyComponentStyle-menuBattlePass{background:rgb(0 0 0/17%);border:2px solid rgba(255,255,255,0.19);border-radius:10px;backdrop-filter:blur(5px);box-shadow:rgba(255,255,255,0) 0px 0px 0px 0px,rgba(255,255,255,0) 0px 0px 0px 0px}.FooterComponentStyle-containerMenu{background:rgba(0,0,0,0.25);backdrop-filter:blur(5px);margin:4px;border-radius:35px;border:2px solid rgba(255,255,255,0.23)}.MainScreenComponentStyle-containerPanel{background:rgba(0,0,0,0.1);backdrop-filter:blur(5px);border-bottom-left-radius:30px;border-bottom-right-radius:30px;border:2px solid rgba(255,255,255,0.18)}.UserInfoContainerStyle-blockLeftPanel>div>div{background:rgba(0,0,0,0);border:0px solid rgba(255,255,255,0.17)}.Common-flexCenterAlignCenter{border:0px solid rgba(255,255,255,0.17)}.PrimaryMenuItemComponentStyle-itemCommonLi.PrimaryMenuItemComponentStyle-menuItemContainer{background:rgba(0,0,0,0.2);width:23em;margin:6px;backdrop-filter:blur(5px);border-radius:23px;left:-2em;top:2%;border:2px solid rgba(255,255,255,0.17)}.MainScreenComponentStyle-buttonPlay{background:rgba(0,0,0,0.3);box-shadow:rgba(255,255,255,0) 0px 0px 0px 0px,rgba(255,255,255,0) 0px 0px 0px 0px;backdrop-filter:blur(5px);border:2px solid rgba(255,255,255,0.21);border-radius:25px;left:-1em;width:27em}.MainScreenComponentStyle-playButtonContainer.MainScreenComponentStyle-buttonPlay.MainScreenComponentStyle-activeItem{background:rgba(0,0,0,0.2);box-shadow:rgba(255,255,255,0) 0px 0px 0px 0px,rgba(255,255,255,0) 0px 0px 0px 0px;backdrop-filter:blur(5px);border:2px solid rgba(255,255,255,0.21);border-radius:25px;left:-2em}.SettingsMenuComponentStyle-menuItemOptions{background:rgb(0 0 0/20%);border-radius:20px;margin:3px;border:2px solid rgba(255,255,255,0.22);height:11%}.LobbyLoaderComponentStyle-loaderContainer{visibility:hidden !important}.SettingsMenuComponentStyle-slideMenuOptions{visibility:hidden !important}.BattlePassLobbyComponentStyle-menuBattlePass{transition:box-shadow 0.75s !important;box-shadow:unset !important}.BattlePassLobbyComponentStyle-menuBattlePass:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.05em !important}.FooterComponentStyle-containerMenu{transition:box-shadow 0.7s !important;box-shadow:unset !important}.FooterComponentStyle-containerMenu:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.MainScreenComponentStyle-buttonPlay{transition:box-shadow 0.6s !important;box-shadow:unset !important}.MainScreenComponentStyle-buttonPlay:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.PrimaryMenuItemComponentStyle-itemCommonLi.PrimaryMenuItemComponentStyle-menuItemContainer{transition:box-shadow 0.3s !important;box-shadow:unset !important}.PrimaryMenuItemComponentStyle-itemCommonLi.PrimaryMenuItemComponentStyle-menuItemContainer:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.SettingsMenuComponentStyle-menuItemOptions{transition:box-shadow 0.6s !important;box-shadow:unset !important}.SettingsMenuComponentStyle-menuItemOptions:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.08em !important}.SuppliesComponentStyle-cellAdd{background:rgb(0 0 0/20%);border-radius:12px;border:2px solid rgba(255,255,255,0.23)}.SuppliesComponentStyle-cellAdd{transition:box-shadow 0.7s !important;box-shadow:unset !important}.SuppliesComponentStyle-cellAdd:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.SuppliesComponentStyle-decorLine{visibility:hidden !important}.SuppliesComponentStyle-screenShotButtonOpen{border:0px solid rgba(255,255,255,0.2)}.MountedItemsStyle-commonForCellResistenceName.Common-backgroundImage{background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.2);border-radius:18px}.MountedItemsStyle-commonForCellResistenceName.Common-backgroundImage{transition:box-shadow 0.7s !important;box-shadow:unset !important}.MountedItemsStyle-commonForCellResistenceName.Common-backgroundImage:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.GarageProtectionsComponentStyle-equipmentResistance.GarageProtectionsComponentStyle-freeSlot{background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.23);border-radius:20px}.GarageProtectionsComponentStyle-equipmentResistance.GarageProtectionsComponentStyle-freeSlot{transition:box-shadow 0.7s !important;box-shadow:unset !important}.GarageProtectionsComponentStyle-equipmentResistance.GarageProtectionsComponentStyle-freeSlot:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.GarageProtectionsComponentStyle-mountedResistActive{background:rgb(66 150 66/30%);border-radius:19px;border:2px solid rgba(151,154,170,0.2)}.GarageProtectionsComponentStyle-mountedResistActive{transition:box-shadow 0.7s !important;box-shadow:unset !important}.GarageProtectionsComponentStyle-mountedResistActive:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important;background:rgb(66 150 66/30%);border-radius:19px}.Common-itemStyle{background:rgb(0 0 0/20%);border:2px solid rgba(255,255,255,0.23);margin:2px;border-radius:13px}.Common-itemStyle{transition:box-shadow 0.7s !important;box-shadow:unset !important}.Common-itemStyle:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.TankParametersStyle-leftParamsContainer{background-color:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.23);border-radius:10px}.MountedItemsStyle-commonBlockDrone.Common-dropFilter{border-radius:13px;background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.23);margin-top:3px}.MountedItemsStyle-commonBlockDrone.Common-dropFilter{transition:box-shadow 0.5s !important;box-shadow:unset !important}.MountedItemsStyle-commonBlockDrone.Common-dropFilter:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.MountedItemsStyle-commonBlockPaint.Common-dropFilter{border-radius:13px;background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.22);margin-top:3px}.MountedItemsStyle-commonBlockPaint.Common-dropFilter{transition:box-shadow 0.8s !important;box-shadow:unset !important}.MountedItemsStyle-commonBlockPaint.Common-dropFilter:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.MountedItemsStyle-commonBlockForTurretsHulls.Common-dropFilter.MountedItemsComponentStyleMobile-commonBlockForTurretsWeapon.MountedItemsComponentStyleMobile-commonBlockForTurretsHulls{border-radius:15px;background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.22)}.MountedItemsStyle-commonBlockForTurretsHulls.Common-dropFilter.MountedItemsComponentStyleMobile-commonBlockForTurretsWeapon.MountedItemsComponentStyleMobile-commonBlockForTurretsHulls{transition:box-shadow 0.7s !important;box-shadow:unset !important}.MountedItemsStyle-commonBlockForTurretsHulls.Common-dropFilter.MountedItemsComponentStyleMobile-commonBlockForTurretsWeapon.MountedItemsComponentStyleMobile-commonBlockForTurretsHulls:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.MountedItemsStyle-commonBlockForTurretsHulls.Common-dropFilter.MountedItemsComponentStyleMobile-commonBlockForTurretsHulls{border-radius:15px;background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.22)}.MountedItemsStyle-commonBlockForTurretsHulls.Common-dropFilter.MountedItemsComponentStyleMobile-commonBlockForTurretsHulls{transition:box-shadow 0.7s !important;box-shadow:unset !important}.MountedItemsStyle-commonBlockForTurretsHulls.Common-dropFilter.MountedItemsComponentStyleMobile-commonBlockForTurretsHulls:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.MountedItemsStyle-improvementArrow{filter:brightness(0%);filter:hue-rotate(180deg)}.PrimaryMenuItemComponentStyle-notificationIconNewNews{filter:brightness(80%)}.GarageProtectionsComponentStyle-unequip{visibility:hidden !important}.BreadcrumbsComponentStyle-breadcrumbs>span{filter:brightness(0%);filter:hue-rotate(180deg)}.HotKey-commonBlockForHotKey{border-radius:50px;background:rgb(255 255 255/90%);margin-left:3px}.SmallShowcaseItemComponentStyle-container{border-radius:10px;outline:2px solid rgba(255,255,255,0.15);background:rgb(0 0 0/40%);transition:box-shadow 0.5s !important;box-shadow:unset !important}.ShowcaseItemComponentStyle-header{background:rgb(0 0 0/40%)}.SmallShowcaseItemComponentStyle-container:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important;margin-bottom:0px}.shop-item-component{background:rgb(0 0 0/40%);border-radius:12px;border:2px solid rgba(255,255,255,0.15);transition:box-shadow 0.9s !important;box-shadow:unset !important}.shop-item-component:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important;background:rgb(0 0 0/40%)}.ShopItemComponentStyle-headerContainer{border-bottom:0px solid rgba(255,255,255,0.15);box-shadow:rgb(255,255,255) 0em 0em 0em 0em !important;background:rgb(0 0 0/40%);border-radius:10px;width:131.5px}.VerticalScrollStyle-outerContainerStyle.ShopCategoryOfferSectionStyle-outerContainer{background:rgb(0 0 0/60%)}.Common-flexCenterAlignCenter.ButtonComponentStyle-disabled.AccountSettingsComponentStyle-buttonChangesOptions{background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.22);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.ButtonComponentStyle-disabled.AccountSettingsComponentStyle-buttonChangesOptions:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0em !important}.Common-flexCenterAlignCenter.AccountSettingsComponentStyle-buttonChangesOptions{background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.22);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.AccountSettingsComponentStyle-buttonChangesOptions:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexCenterAlignCenter.ButtonComponentStyle-disabled.AccountSettingsComponentStyle-buttonConnectOptions{background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.17);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.ButtonComponentStyle-disabled.AccountSettingsComponentStyle-buttonConnectOptions:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0em !important}.Common-flexCenterAlignCenter.AccountSettingsComponentStyle-buttonConnectOptions{background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.17);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.AccountSettingsComponentStyle-buttonConnectOptions:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexCenterAlignCenter.SettingsButtonsComponentStyle-buttonsWidthBackReset{background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.22);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.SettingsButtonsComponentStyle-buttonsWidthBackReset:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexCenterAlignCenter.GameSettingsStyle-button{background:rgb(0 0 0/10%);border:2px solid rgba(255,255,255,0.22);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.GameSettingsStyle-button:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexCenterAlignCenter.DialogContainerComponentStyle-keyButton{background:rgb(0 0 0/10%);border:2px solid rgba(255,255,255,0.22);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.DialogContainerComponentStyle-keyButton:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexCenterAlignCenter.DialogContainerComponentStyle-enterButton{background:rgb(0 0 0/10%);border:2px solid rgba(255,255,255,0.22);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.DialogContainerComponentStyle-enterButton:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.BasePaymentComponentStyle-container{background:rgb(0 0 0/60%);border:2px solid rgba(255,255,255,0.23);border-radius:12px;opacity:0;animation:vb 0.9s forwards}@keyframes vb{0%{opacity:0}100%{opacity:1}}.BasePaymentComponentStyle-buttonContainer>div{background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.17);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.BasePaymentComponentStyle-buttonContainer>div:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.BasePaymentComponentStyle-backButtonContainer>div{background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.17);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.BasePaymentComponentStyle-backButtonContainer>div:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.SuccessfulPurchaseComponentStyle-container{background:rgb(0 0 0/20%);border:2px solid rgba(255,255,255,0.17);border-radius:17px;backdrop-filter:blur(5px)}.SuccessfulPurchaseComponentStyle-content>div>.Common-flexCenterAlignCenter>div{background:rgb(0 0 0/0%);border:2px solid rgba(255,255,255,0.17);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.SuccessfulPurchaseComponentStyle-content>div>.Common-flexCenterAlignCenter>div:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexCenterAlignCenterColumn.SkinCellStyle-widthHeight{background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.17);border-radius:12px;margin:3px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.Common-flexCenterAlignCenterColumn.SkinCellStyle-widthHeight:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.GarageCommonStyle-positionContentAlteration.GarageCommonStyle-subMenu{border:0px solid rgba(255,255,255,0.17)}.Common-flexSpaceBetweenAlignStartColumn{background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.17);border-radius:12px}.SquarePriceButtonComponentStyle-commonBlockButton.SquarePriceButtonComponentStyle-buttonBase.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter.AlterationButtonStyle-buyButton.AlterationButtonStyle-commonButton.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter.GarageTurretsAlterationsComponentStyle-containerButton.MountedItemsComponentStyleMobile-commonButtonUpdate{background:rgb(0 0 0/0%);border:2px solid rgba(255,255,255,0.22);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important;top:5px}.SquarePriceButtonComponentStyle-commonBlockButton.SquarePriceButtonComponentStyle-buttonBase.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter.AlterationButtonStyle-buyButton.AlterationButtonStyle-commonButton.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter.GarageTurretsAlterationsComponentStyle-containerButton.MountedItemsComponentStyleMobile-commonButtonUpdate:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.PrimaryMenuItemComponentStyle-discountNotification{border-radius:15px;filter:brightness(0%);filter:hue-rotate(180deg);margin-right:2em}.Common-discount{border-radius:15px;filter:brightness(0%);filter:hue-rotate(180deg)}.SuppliesComponentStyle-discountLabel{border-radius:15px;filter:brightness(0%);filter:hue-rotate(180deg)}.ClanInfoComponentStyle-messageClan{border-radius:15px;background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.23);margin-bottom:2px}.ClanHeaderComponentStyle-blockInform{border-radius:15px;background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.23)}.ClanCommonStyle-row{border-radius:12px;background:rgb(0 0 0/40%);margin:5px;border:2px solid rgba(255,255,255,0.23);transition:box-shadow 0.6s !important;box-shadow:unset !important}.ClanCommonStyle-row:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.TableComponentStyle-table thead tr{border-radius:12px;background:rgb(0 0 0/40%)}.Common-flexCenterAlignCenter.ClanCommonStyle-buttonInvite.ClanProfileEditComponentStyle-buttonCancel{background:rgb(0 0 0/0%);border:2px solid rgba(255,255,255,0.23);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.ClanCommonStyle-buttonInvite.ClanProfileEditComponentStyle-buttonCancel:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.FriendListComponentStyle-blockList.nickNameClass{background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.23);border-radius:13px;margin-bottom:-5px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.FriendListComponentStyle-blockList.nickNameClass:hover{background:rgb(0 0 0/40%);box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.EventBattlePassLobbyComponentStyle-buttonEventBattlePass{background:rgb(0 0 0/17%);border-radius:13px;outline:2px solid rgba(255,255,255,0.2);backdrop-filter:blur(5px);box-shadow:rgba(255,255,255,0) 0px 0px 0px 0px,rgba(255,255,255,0) 0px 0px 0px 0px}.EventBattlePassLobbyComponentStyle-buttonEventBattlePass{transition:box-shadow 0.5s !important;box-shadow:unset !important}.EventBattlePassLobbyComponentStyle-buttonEventBattlePass:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.ChatComponentStyle-messageRow{background:rgb(0 0 0/17%);border-radius:13px}.GarageCommonStyle-garageContainer{background:rgb(0 0 0/45%);aspect-ratio:4 / 3}.Common-flexCenterAlignCenter.FriendListComponentStyle-buttonAddFriends.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter{background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.2);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.FriendListComponentStyle-buttonAddFriends.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexCenterAlignCenter.ButtonComponentStyle-disabled.FriendListComponentStyle-buttonDisableAdd.FriendListComponentStyle-containerButtonFriends{background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.17);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.ButtonComponentStyle-disabled.FriendListComponentStyle-buttonDisableAdd.FriendListComponentStyle-containerButtonFriends:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexCenterAlignCenter.FriendListComponentStyle-buttonCloseAddFriends{background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.17);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.FriendListComponentStyle-buttonCloseAddFriends:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexCenterAlignCenter.JoinToBattleComponentStyle-newButtonJoinA.JoinToBattleComponentStyle-buttonJoin{background:rgb(0 0 0/40%);box-shadow:rgb(255,255,255) 0em 0em 0em 0em !important;outline:0px solid rgba(255,255,255,0.17)}.ClanInfoComponentStyle-clanForeignActions>div{background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.2);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.ClanInfoComponentStyle-clanForeignActions>div:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.ClanInfoComponentStyle-clanForeignActions>span{background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.2);border-radius:15px;margin-right:3px}.MenuComponentStyle-mainMenuItem.Common-activeMenu{color:rgb(255,188,9)}.Common-flexCenterAlignCenter{outline:0px solid rgba(255,255,255,0.17);box-shadow:rgb(255,255,255) 0em 0em 0em 0em !important}.SearchInputComponentStyle-search>div>input{background:rgb(0 0 0/40%);outline:2px solid rgba(255,255,255,0.2);box-shadow:rgb(255,255,255) 0em 0em 0em 0em !important;border-radius:12px}.AccountSettingsComponentStyle-blockChangePassword>div>input{background:rgb(0 0 0/40%);outline:1px solid rgba(255,255,255,0.2);box-shadow:rgb(255,255,255) 0em 0em 0em 0em !important;border-radius:12px;margin-top:5px;margin:2px}.AccountSettingsComponentStyle-blockInputEmail>input{background:rgb(0 0 0/40%);outline:1px solid rgba(255,255,255,0.2);box-shadow:rgb(255,255,255) 0em 0em 0em 0em !important;border-radius:12px;margin-top:5px}.AccountSettingsComponentStyle-chargedWriting{margin-top:7px}.SuccessfulPurchaseComponentStyle-content>.Common-flexCenterAlignCenter>div{background:rgb(0 0 0/40%);outline:2px solid rgba(255,255,255,0.17);border-radius:12px;transition:box-shadow 0.3s !important;box-shadow:unset !important}.SuccessfulPurchaseComponentStyle-content>.Common-flexCenterAlignCenter>div:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.NewsComponentStyle-newsWindow{background:rgb(0 0 0/35%);backdrop-filter:blur(7px);opacity:0;animation:sss 1s forwards}@keyframes sss{0%{opacity:0}100%{opacity:1}}.ClanInvitationsComponentStyle-invitationContent{background:rgb(12 12 12/37%);border:2px solid rgba(255,255,255,0.2);backdrop-filter:blur(6px);border-radius:15px}.BattleCreateComponentStyle-formNameBattle input[type="text"]{background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.2);box-shadow:rgba(255,255,255,0) 0px 0px 0px 0px,rgba(255,255,255,0) 0px 0px 0px 0px;border:2px solid rgba(255,255,255,0.2);border-radius:12px}.InputComponentStyle-defaultStyle{background:rgb(0 0 0/40%);outline:2px solid rgba(255,255,255,0.2);box-shadow:rgb(255,255,255) 0em 0em 0em 0em !important;border-radius:12px}.DropDownStyle-dropdownControl{background:rgb(0 0 0/40%);outline:1px solid rgba(255,255,255,0.25);box-shadow:rgb(255,255,255) 0em 0em 0em 0em !important;border-radius:12px}.VerticalScrollStyle-outerContainerStyle.DropDownStyle-outerContainerStyle.DropDownStyle-dropdownMenu.Common-displayFlex>div>div{background:rgb(0 0 0/40%);border-radius:12px}.MainQuestComponentStyle-container{background:rgb(0 0 0/20%);border-radius:10px;border:2px solid rgba(255,255,255,0.2);margin:3px}.ScrollingCardsComponentStyle-scrollCard.cardImg{border-radius:13px;margin:5px;outline:2px solid rgba(255,255,255,0.2);transition:box-shadow 0.5s !important;box-shadow:unset !important}.ScrollingCardsComponentStyle-scrollCard.cardImg:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexSpaceBetweenAlignCenterColumn.descriptionMode.blockCard{border-radius:13px;background:rgb(0 0 0/20%);margin:5px;outline:1px solid rgba(255,255,255,0.25);transition:box-shadow 0.7s !important;box-shadow:unset !important}.Common-flexSpaceBetweenAlignCenterColumn.descriptionMode.blockCard:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.RewardItemComponentStyle-fastAppearance{background:rgb(0 0 0/30%);border-radius:10px;border:2px solid rgba(255,255,255,0.2);backdrop-filter:blur(5px);transition:box-shadow 0.6s !important;box-shadow:unset !important}.BattlePickComponentStyle-commonStyleBlock.cardImgEvents.BattlePickComponentStyle-styleIsEnableBlock{border-radius:25px;outline:2px solid rgba(255,255,255,0.2);transition:box-shadow 0.8s !important;box-shadow:unset !important}.BattlePickComponentStyle-commonStyleBlock.cardImgEvents.BattlePickComponentStyle-styleIsEnableBlock:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.BattlePickComponentStyle-commonStyleBlock.cardImgEvents{border-radius:25px;outline:2px solid rgba(255,255,255,0.2);transition:box-shadow 0.8s !important;box-shadow:unset !important}.BattlePickComponentStyle-commonStyleBlock.cardImgEvents:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.BattlePickComponentStyle-modeCards{opacity:0;animation:yes 0.3s forwards}@keyframes yes{0%{opacity:0}100%{opacity:1}}.ProBattlesComponentStyle-mainContainer{opacity:0;animation:yess 0.9s forwards}@keyframes yess{0%{opacity:0}100%{opacity:1}}.BattleCreateComponentStyle-mainContainer{opacity:0;animation:st 0.9s forwards}@keyframes st{0%{opacity:0}100%{opacity:1}}.SettingsComponentStyle-blockContentOptions{opacity:0;animation:vs 0.7s forwards}@keyframes vs{0%{opacity:0}100%{opacity:1}}.FriendListComponentStyle-containerFriends{opacity:0;animation:vss 0.7s forwards}@keyframes vss{0%{opacity:0}100%{opacity:1}}.ContainersStyle-lootBoxContainers{opacity:0;animation:trs 0.9s forwards}@keyframes trs{0%{opacity:0}100%{opacity:1}}.BattleInfoComponentStyle-blockCard{border-radius:15px}.VerticalScrollStyle-outerContainerStyle.DropDownStyle-outerContainerStyle.DropDownStyle-dropdownMenu.Common-displayFlex>div>div>div{border-radius:12px;background:rgb(0 0 0/40%);backdrop-filter:blur(5px);margin:4px;outline:2px solid rgba(255,255,255,0.2);transition:box-shadow 0.7s !important;box-shadow:unset !important}.VerticalScrollStyle-outerContainerStyle.DropDownStyle-outerContainerStyle.DropDownStyle-dropdownMenu.Common-displayFlex>div>div>div:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.KeyboardSettingsComponentStyle-keyInput{border-radius:8px;background:rgb(0 0 0/10%);outline:1px solid rgba(255,255,255,0.2)}.KeyMappingWithIconComponentStyle-commonBlockSupplies{background:rgb(0 0 0/40%);outline:1px solid rgba(255,255,255,0.2);border-radius:8px}.KeyMappingWithIconComponentStyle-overdrives{background:rgb(0 0 0/40%);outline:1px solid rgba(255,255,255,0.2);border-radius:50px}.GarageProtectionsComponentStyle-equipmentResistance.GarageProtectionsComponentStyle-mountedResist{outline:2px solid rgba(255,255,255,0.2);border-radius:19px;background:rgb(0 0 0/40%);transition:box-shadow 0.7s !important;box-shadow:unset !important}.GarageProtectionsComponentStyle-equipmentResistance.GarageProtectionsComponentStyle-mountedResist:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}#root>div>div>div>div>div>div>form>div{background:rgb(0 0 0/40%);outline:1px solid rgba(255,255,255,0.2);border-radius:12px}.AccountSettingsComponentStyle-informationWriting{margin-top:6px}.AccountSettingsComponentStyle-labelInputEmail{margin-bottom:6px}.ClanCreateComponentStyle-blockCreatureClan{background:rgb(0 0 0/19%);backdrop-filter:blur(20px);opacity:0;animation:vsss 0.9s forwards}@keyframes vsss{0%{opacity:0}100%{opacity:1}}.Common-flexCenterAlignCenterColumn.blockCard{border-radius:12px;outline:2px solid rgba(255,255,255,0.2);background:rgb(0 0 0/20%);transition:box-shadow 0.9s !important;box-shadow:unset !important}.Common-flexCenterAlignCenterColumn.blockCard:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexStartAlignCenterColumn{opacity:0;animation:vssss 0.9s forwards}@keyframes vssss{0%{opacity:0}100%{opacity:1}}.BattleModesComponentStyle-blockCenter{opacity:0;animation:sts 1.2s forwards}@keyframes sts{0%{opacity:0}100%{opacity:1}}.FormatsSectionComponentStyle-unSelectedCard{border-radius:15px;outline:2px solid rgba(255,255,255,0.2);margin:5px;transition:box-shadow 0.9s !important;box-shadow:unset !important}@keyframes cst{0%{opacity:0}100%{opacity:1}}.FormatsSectionComponentStyle-unSelectedCard:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.FormatsSectionComponentStyle-selectedCard.cardImg{border-radius:15px;outline:2px solid rgba(255,255,255,0.2);margin:5px;transition:box-shadow 0.9s !important;box-shadow:unset !important}@keyframes cst{0%{opacity:0}100%{opacity:1}}.FormatsSectionComponentStyle-SelectedCard.cardImg:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexStartAlignStretch.SettingsComponentStyle-scrollCreateBattle.Common-scrollBarHoverVisible{background:rgb(0 0 0/40%);opacity:0;animation:cstt 0.8s forwards}@keyframes cstt{0%{opacity:0}100%{opacity:1}}.BattleCreateComponentStyle-scrollBattlePick.BattleCreateComponentStyle-blockCard.Common-scrollBarVisible{opacity:0;animation:a 0.8s forwards}@keyframes a{0%{opacity:0}100%{opacity:1}}.ScrollingCardsComponentStyle-blockCenter{opacity:0;animation:aA 0.8s forwards}@keyframes aA{0%{opacity:0}100%{opacity:1}}.OpenContainerStyle-containerLootBoxes{opacity:0;animation:bB 0.9s forwards}@keyframes bB{0%{opacity:0}100%{opacity:1}}.NewShopCommonComponentStyle-marginButtonContainer{opacity:0;animation:zZ 0.9s forwards}@keyframes zZ{0%{opacity:0}100%{opacity:1}}.ShopCategoryComponentStyle-itemsContainer{opacity:0;animation:zZz 0.9s forwards}@keyframes zZz{0%{opacity:0}100%{opacity:1}}.Common-flexCenterAlignCenter.ButtonComponentStyle-disabled.ContainersStyle-openBuyButton{background:rgb(0 0 0/40%);outline:2px solid rgba(255,255,255,0.17);border-radius:12px;transition:box-shadow 0.3s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.ButtonComponentStyle-disabled.ContainersStyle-openBuyButton:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0em !important}.Common-flexCenterAlignCenter.ContainersStyle-openBuyButton{background:rgb(0 0 0/20%);outline:2px solid rgba(255,255,255,0.17);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.ContainersStyle-openBuyButton:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexCenterAlignCenter.PossibleRewardsStyle-buttonShowAll.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter.ContainersStyleMobile-buttonShowAll{background:rgb(0 0 0/40%);outline:2px solid rgba(255,255,255,0.17);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.PossibleRewardsStyle-buttonShowAll.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter.ContainersStyleMobile-buttonShowAll:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.ContainerInfoComponentStyle-backButtonContainer{background:rgb(0 0 0/40%);outline:2px solid rgba(255,255,255,0.17);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.ContainerInfoComponentStyle-backButtonContainer:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexCenterAlignCenter.ButtonComponentStyle-disabled.InvitationWindowsComponentStyle-inviteButton.Font-bold.Font-normal.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter{background:rgb(0 0 0/40%);outline:2px solid rgba(255,255,255,0.17);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important;width:15em}.Common-flexCenterAlignCenter.ButtonComponentStyle-disabled.InvitationWindowsComponentStyle-inviteButton.Font-bold.Font-normal.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0em !important}.Common-flexCenterAlignCenter.InvitationWindowsComponentStyle-backButton.Font-bold.Font-normal.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter{background:rgb(0 0 0/40%);outline:2px solid rgba(255,255,255,0.17);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.InvitationWindowsComponentStyle-backButton.Font-bold.Font-normal.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexCenterAlignCenter.InvitationWindowsComponentStyle-inviteButton.Font-bold.Font-normal.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter{background:rgb(0 0 0/40%);outline:2px solid rgba(255,255,255,0.17);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important;width:16em}.Common-flexCenterAlignCenter.InvitationWindowsComponentStyle-inviteButton.Font-bold.Font-normal.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.SquarePriceButtonComponentStyle-commonBlockButton.SquarePriceButtonComponentStyle-buttonBase.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter.TanksPartBaseComponentStyle-marginTop.MountedItemsComponentStyleMobile-buttonEstablished.MountedItemsComponentStyleMobile-commonButtonUpdate{background:rgb(0 0 0/40%);outline:2px solid rgba(255,255,255,0.22);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important;top:5px}.SquarePriceButtonComponentStyle-commonBlockButton.SquarePriceButtonComponentStyle-buttonBase.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter.TanksPartBaseComponentStyle-marginTop.MountedItemsComponentStyleMobile-buttonEstablished.MountedItemsComponentStyleMobile-commonButtonUpdate:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0em !important}.SquarePriceButtonComponentStyle-commonBlockButton SquarePriceButtonComponentStyle-buttonBase.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter.TanksPartBaseComponentStyle-marginTop.MountedItemsComponentStyleMobile-buttonEstablished.MountedItemsComponentStyleMobile-commonButtonUpdate{background:rgb(0 0 0/40%);outline:2px solid rgba(255,255,255,0.22);border-radius:12px;transition:box-shadow 0.8s !important;box-shadow:unset !important}.SquarePriceButtonComponentStyle-commonBlockButton.SquarePriceButtonComponentStyle-buttonBase.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter.TanksPartBaseComponentStyle-marginTop.MountedItemsComponentStyleMobile-buttonEstablished.MountedItemsComponentStyleMobile-commonButtonUpdate:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.SquarePriceButtonComponentStyle-commonBlockButton.SquarePriceButtonComponentStyle-buttonBase.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter.MountedItemsComponentStyleMobile-commonButtonUpdate{outline:2px solid rgba(255,255,255,0.22);border-radius:12px;transition:box-shadow 0.3s !important;box-shadow:unset !important}.SquarePriceButtonComponentStyle-commonBlockButton.SquarePriceButtonComponentStyle-buttonBase.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter.MountedItemsComponentStyleMobile-commonButtonUpdate:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.BattleKillBoardComponentStyle-tableContainer table tbody #enemyCommand{background:rgb(69 0 0/30%);border-radius:12px;border:2px solid rgba(255,255,255,0.2);margin:2px;backdrop-filter:blur(5px)}.BattleKillBoardComponentStyle-tableContainer table tbody #selfUserBg{background:rgb(33 33 150/30%);margin:2px;border-radius:12px;border:2px solid rgba(255,255,255,0.2);backdrop-filter:blur(7px)}.BattleKillBoardComponentStyle-tableContainer table tbody #blueCommand{background:rgb(0 0 69/30%);border-radius:12px;border:2px solid rgba(255,255,255,0.2);margin:2px;backdrop-filter:blur(5px)}.SettingsComponentStyle-scrollingMenu{background:rgb(0 0 0/10%)}.ShopCategoryComponentStyle-header{color:rgb(255,188,9)}.PaymentInfoComponentStyle-header{color:rgb(255,188,9)}.CoinPaymentComponentStyle-header{color:rgb(255,188,9)}.Common-whiteSpaceNoWrap.ShopItemComponentStyle-headerContent{color:rgb(255,188,9)}.PaymentInfoItemComponentStyle-itemName{color:rgb(255,188,9)}.ClanCommonStyle-content{background:rgb(0 0 0/60%);opacity:0;animation:Gg 0.9s forwards}@keyframes Gg{0%{opacity:0}100%{opacity:1}}.ClanCommonStyle-rowEmpty{background:rgb(0 0 0/60%);border-radius:12px;border:2px solid rgba(255,255,255,0.2);margin:2px;backdrop-filter:blur(5px);transition:box-shadow 0.8s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.ButtonComponentStyle-disabled.ClanCommonStyle-buttonSendRequest{background:rgb(0 0 0/60%);border-radius:12px;width:70px;border:2px solid rgba(255,255,255,0.2);backdrop-filter:blur(5px);transition:box-shadow 0.8s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.ButtonComponentStyle-disabled.ClanCommonStyle-buttonSendRequest:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0em !important}.Common-flexCenterAlignCenter.ClanCommonStyle-buttonSendRequest{background:rgb(0 0 0/60%);border-radius:12px;width:70px;border:2px solid rgba(255,255,255,0.2);backdrop-filter:blur(5px);transition:box-shadow 0.8s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.ClanCommonStyle-buttonSendRequest:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.CrystalPaymentComponentStyle-header{color:rgb(255,188,9)}.Common-flexSpaceBetweenAlignStretchColumn.Common-flexWrapNowrap.Common-overflowScrollFriends{background:rgb(0 0 0/60%);border-radius:12px;border:2px solid rgba(255,255,255,0.2)}.ChoosePaymentMethodComponentStyle-header{color:rgb(255,188,9)}.ShowcaseItemComponentStyle-headerContent{color:rgb(255,188,9)}.DialogContainerComponentStyle-header h1{color:rgb(255,188,9)}.ScrollingCardsComponentStyle-cardName h2{color:rgb(255,188,9)}.BattlePauseMenuComponentStyle-enabledButton{background:rgb(0 0 0/20%);backdrop-filter:blur(5px);border-radius:12px;border:2px solid rgba(255,255,255,0.2);transition:box-shadow 0.8s !important;box-shadow:unset !important}.BattlePauseMenuComponentStyle-enabledButton:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important;background:rgb(0 0 0/0%)}.BattlePauseMenuComponentStyle-redMenuButton.BattlePauseMenuComponentStyle-enabledButton.BattlePauseMenuComponentStyle-selectedRedMenuButton>span{color:#ff0000}.BattlePauseMenuComponentStyle-dialogFooter{background:rgb(0 0 0/0%)}.ScrollingCardsComponentStyle-cardCount{background:rgb(255,188,9)}.MainQuestComponentStyle-description h3{color:rgb(255,188,9)}.MainQuestComponentStyle-progress{background-color:rgb(255,188,9)}.ClanInfoComponentStyle-header{color:rgb(255,188,9)}.TableComponentStyle-table thead tr th h2{color:rgb(255,188,9)}.PossibleRewardsStyle-commonBlockPossibleRewards h2{color:rgb(255,188,9)}.ContainersStyle-blockDescriptionContainers h1{color:rgb(255,188,9)}.Common-menuItemActive{color:rgb(255,188,9)}.MainQuestComponentStyle-buttonContainer{background:rgb(0 0 0/20%)}.MainQuestComponentStyle-container.MainQuestComponentStyle-rewardGivenBg{background-color:rgb(0 0 0 / 60%)}.Common-flexCenterAlignCenterColumn.TierItemComponentStyle-receivedItem{border-radius:15px;border:1px solid rgba(255,255,255,0.15)}.Common-flexCenterAlignCenterColumn.TierItemComponentStyle-receivedItemPremium{border-radius:15px;border:1px solid rgba(255,255,255,0.15)}.QuestsChallengesComponentStyle-blockGradient{background-image:radial-gradient(170.14% 100% at 50% 0%,rgb(0 0 0 / 75%) 0%,rgb(123 29 29 / 50%) 50%,rgba(255,51,51,0) 100%)}.QuestsChallengesComponentStyle-maxTierBlockFree{display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(170.14% 100% at 50% 100%,rgb(99 115 146 / 25%) 0%,rgba(191,212,255,0) 100%)}.QuestsChallengesComponentStyle-blockGradientEvent{background-image:radial-gradient(170.83% 50% at 0% 50%,rgb(0 0 0 / 75%) 0%,rgb(121 77 77 / 50%) 50%,rgb(0 0 0 / 0%) 100%)}.QuestsChallengesComponentStyle-eventTier{background-image:radial-gradient(170.83% 50% at 0% 50%,rgb(0 0 0 / 75%) 0%,rgb(121 77 77 / 50%) 50%,rgb(0 0 0 / 0%) 100%)}.BattlePauseMenuComponentStyle-menuButton.BattlePauseMenuComponentStyle-disabledButton{border-radius:12px}.BattleMessagesComponentStyle-messageRow{position:absolute;top:29%;left:1em}.BattleMessagesComponentStyle-message{background:rgb(0 0 0 /27%);border:2px solid rgba(255,255,255,0.2);backdrop-filter:blur(7px);border-radius:10px}.BreadcrumbsComponentStyle-backButton h3{border-radius:50px}.TableComponentStyle-row{border-radius:12px;background:rgb(0 0 0/40%);outline:2px solid rgba(255,255,255,0.2);margin-top:6px}.FriendRequestComponentStyle-buttonAccept{background:rgb(0 0 0/0%);backdrop-filter:blur(5px);border-radius:12px;transition:box-shadow 0.8s !important;box-shadow:unset !important}.FriendRequestComponentStyle-buttonAccept:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important;background:rgb(0 0 0/0%)}.FriendRequestComponentStyle-buttonDecline{background:rgb(0 0 0/0%);backdrop-filter:blur(5px);border-radius:12px;transition:box-shadow 0.8s !important;box-shadow:unset !important}.FriendRequestComponentStyle-buttonDecline:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important;background:rgb(0 0 0/0%)}.FriendRequestComponentStyle-buttonDeclineAll{border-radius:12px;background:rgb(0 0 0/40%);outline:2px solid rgba(255,255,255,0.2);transition:box-shadow 0.8s !important;box-shadow:unset !important}.FriendRequestComponentStyle-buttonDeclineAll:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important;background:rgb(0 0 0/0%)}.FriendRequestComponentStyle-buttonDeclineAllInvisible{border-radius:12px;background:rgb(0 0 0/40%);outline:2px solid rgba(255,255,255,0.2)}.ProBattlesComponentStyle-mainContainer>div>.Common-flexStartAlignCenterColumn>div>.Common-flexCenterAlignCenter>span{color:rgb(255,188,9)}.BattlePassLobbyComponentStyle-blockBattlePass{border-radius:12px}.ListItemsComponentStyle-itemsListContainer{background:rgb(0 0 0/10%)}.ItemDescriptionComponentStyle-captionDevice.Common-flexSpaceAroundAlignStretchColumn.Common-displayFlexColumn.Common-displayFlex.Common-alignStretch{border-radius:12px;background:rgb(0 0 0/40%);outline:2px solid rgba(255,255,255,0.2);transition:box-shadow 0.8s !important;box-shadow:unset !important}.ItemDescriptionComponentStyle-captionDevice.Common-flexSpaceAroundAlignStretchColumn.Common-displayFlexColumn.Common-displayFlex.Common-alignStretch:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.ItemDescriptionComponentStyle-commonBlockModal{background:rgb(0 0 0/5%);backdrop-filter:blur(4px)}.Common-flexCenterAlignCenter.TutorialModalComponentStyle-navigationButton.ItemDescriptionComponentStyle-blockButtons{border-radius:12px;background:rgb(0 0 0/40%);outline:2px solid rgba(255,255,255,0.2);transition:box-shadow 0.8s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.TutorialModalComponentStyle-navigationButton.ItemDescriptionComponentStyle-blockButtons:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.TutorialModalComponentStyle-contentWrapper{background:rgb(0 0 0/5%);backdrop-filter:blur(4px)}.Common-flexCenterAlignCenter.TutorialModalComponentStyle-navigationButton{border-radius:12px;background:rgb(0 0 0/40%);outline:2px solid rgba(255,255,255,0.2);transition:box-shadow 0.8s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.TutorialModalComponentStyle-navigationButton:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexCenterAlignCenter.ButtonComponentStyle-disabled.TutorialModalComponentStyle-navigationButton:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0em !important}.FriendListComponentStyle-containerMember{opacity:0;animation:zZzz 0.7s forwards}@keyframes zZzz{0%{opacity:0}100%{opacity:1}}.TooltipStyle-tooltip{background:rgb(0 0 0/17%);backdrop-filter:blur(7px);border-radius:15px;outline:2px solid rgba(255,255,255,0.15);box-shadow:rgba(255,255,255,0) 0px 0px 0px 0px,rgba(255,255,255,0) 0px 0px 0px 0px}.Common-flexCenterAlignCenter.ButtonComponentStyle-disabled.ClanInvitationsComponentStyle-sendButton{border-radius:12px;background:rgb(0 0 0/0%);outline:2px solid rgba(255,255,255,0.2);transition:box-shadow 0.8s !important;box-shadow:unset !important;width:150px;margin-left:20px}.Common-flexCenterAlignCenter.ButtonComponentStyle-disabled.ClanInvitationsComponentStyle-sendButton:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0em !important}.Common-flexCenterAlignCenter.ClanInvitationsComponentStyle-sendButton{border-radius:12px;background:rgb(0 0 0/0%);outline:2px solid rgba(255,255,255,0.2);transition:box-shadow 0.8s !important;box-shadow:unset !important;width:170px;margin-left:20px}.Common-flexCenterAlignCenter.ClanInvitationsComponentStyle-sendButton:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.ClanSelfRequestsItemComponentStyle-creationDateCell>div{border-radius:12px;background:rgb(0 0 0/0%);transition:box-shadow 0.8s !important;box-shadow:unset !important}.ClanSelfRequestsItemComponentStyle-creationDateCell>div:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.ProBattlesComponentStyle-createBattleButton{background:rgb(0 0 0/0%)}.Common-flexCenterAlignCenter.SecuritySettingsComponentStyle-button{border-radius:12px;background:rgb(0 0 0/0%);outline:2px solid rgba(255,255,255,0.2);transition:box-shadow 0.8s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.SecuritySettingsComponentStyle-button:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.RankupComponentStyle-wrapper{width:100%;min-width:71.25em;min-height:31.25em;display:flex;flex-flow:column wrap;justify-content:center;align-items:center;position:relative;z-index:20;height:31.25em;-webkit-box-pack:center;-webkit-box-align:center;-webkit-box-orient:vertical;-webkit-box-direction:normal;background:rgb(0 0 0/0%);opacity:0;animation:zkkk 0.7s forwards}@keyframes zkkk{0%{opacity:0}100%{opacity:1}}.ScrollBarStyle-itemsContainer{background:rgb(0 0 0/0%);border-radius:15px}.RankupComponentStyle-title{color:rgb(255,188,9)}.RankupUnlockedItemsComponentStyle-unlockedItemsText{font-family:RubikMedium;font-style:normal;font-weight:500;text-transform:uppercase;font-size:1.375em;color:rgb(255,188,9)}.RankupUnlockedItemsComponentStyle-contentWrapper{background:radial-gradient(50% 100% at 50% 100%,rgb(0 0 0 / 30%) 100%,rgb(0 0 0 / 30%) 100%);backdrop-filter:blur(5px);opacity:0;animation:zkk 0.7s forwards}@keyframes zkk{0%{opacity:0}100%{opacity:1}}.BattleChatComponentStyle-inputContainerAll{background:rgb(0 0 0/35%);border-radius:12px;backdrop-filter:blur(5px);border:2px solid rgba(255,255,255,0.2);box-shadow:rgba(255,255,255,0) 0px 0px 0px 0px,rgba(255,255,255,0) 0px 0px 0px 0px;opacity:0;animation:vzvz 0.7s forwards}@keyframes vzvz{0%{opacity:0}100%{opacity:1}}.BattleChatComponentStyle-btnToggleTeamAllies{background:rgb(0 0 0/0%)}.BattleChatComponentStyle-inputContainerAllies{background:rgb(0 0 0/35%);border-radius:12px;backdrop-filter:blur(5px);border:2px solid rgba(255,255,255,0.2);box-shadow:rgba(255,255,255,0) 0px 0px 0px 0px,rgba(255,255,255,0) 0px 0px 0px 0px;opacity:0;animation:zk 0.7s forwards}@keyframes zk{0%{opacity:0}100%{opacity:1}}.BattleChatComponentStyle-btnToggleTeamAll{background:rgb(0 0 0/0%)}.Common-flexStartAlignCenter.Common-whiteSpaceNoWrap.nickNameClass{background-color:rgb(0 0 0/15%);backdrop-filter:blur(5px);border-radius:12px;margin:4px;border:2px solid rgba(255,255,255,0.2);transition:box-shadow 0.8s !important;box-shadow:unset !important}.Common-flexStartAlignCenter.Common-whiteSpaceNoWrap.nickNameClass:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.InvitationWindowsComponentStyle-usersScroll{opacity:0;animation:zkZ 0.7s forwards}@keyframes zkZ{0%{opacity:0}100%{opacity:1}}.GarageProtectionsComponentStyle-freeSlotActive{border:2px solid rgba(255,255,255,0.17);border-radius:19px}.Common-flexCenterAlignCenter.Common-alignSelfFlexEnd{background:rgb(0 0 0/35%);border-radius:12px;border:2px solid rgba(255,255,255,0.22);transition:box-shadow 0.8s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.Common-alignSelfFlexEnd:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexCenterAlignCenter.BattleResultNavigationComponentStyle-disabledButton.BattleResultNavigationComponentStyle-button.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter{background:rgb(0 0 0/10%);border-radius:12px;border:2px solid rgba(255,255,255,0.16);transition:box-shadow 0.8s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.BattleResultNavigationComponentStyle-disabledButton.BattleResultNavigationComponentStyle-button.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexCenterAlignCenter.BattleResultNavigationComponentStyle-buttonNextWithTimer.BattleResultNavigationComponentStyle-buttonWithTimer.Common-flexCenterAlignCenterColumn.Common-displayFlexColumn.Common-displayFlex.Common-alignCenter{background:rgb(0 0 0/10%);border-radius:12px;border:2px solid rgba(255,255,255,0.16);transition:box-shadow 0.8s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.BattleResultNavigationComponentStyle-buttonNextWithTimer.BattleResultNavigationComponentStyle-buttonWithTimer.Common-flexCenterAlignCenterColumn.Common-displayFlexColumn.Common-displayFlex.Common-alignCenter:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.UidInputComponentStyle-dropDownItem{font-family:RubikRegular;font-style:normal;font-weight:normal;font-size:1em;line-height:normal;color:rgb(227 227 227)}.shop-item-component:hover .ShopItemComponentStyle-headerContainer{background:rgba(0,0,0,0.4);transition:background 1s ease 0s}.BattleResultQuestProgressComponentStyle-container{border-radius:12px;background:rgb(0 0 0/100%);margin:5px;transition:box-shadow 0.8s !important;box-shadow:unset !important}.Common-flexStartAlignCenterColumn.QuestsComponentStyle-scrollBlock>div>div>div{background:rgb(0 0 0/100%);border:2px solid rgba(255,255,255,0.2);border-radius:15px;transition:box-shadow 0.8s !important;box-shadow:unset !important;margin:5px}.BattleResultQuestProgressComponentStyle-container:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexCenterAlignCenter.BattleResultNavigationComponentStyle-button.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter{background:rgb(0 0 0/90%);border-radius:12px;border:2px solid rgba(255,255,255,0.16);transition:box-shadow 0.8s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.BattleResultNavigationComponentStyle-button.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.MenuComponentStyle-blockRequests{color:rgb(255 206 76)}.ClanCommonStyle-onlineNickName{color:rgb(255,188,9)}.Need2FaDialogComponentStyle-container{background:rgb(12 12 12/16%);backdrop-filter:blur(5px);border:2px solid rgba(255,255,255,0.2);border-radius:12px}.MainScreenComponentStyle-playButtonContainer span{color:rgb(255,188,9)}.BattlePassLobbyComponentStyle-descriptionMenuPass>div>span{color:rgb(255,188,9)}.Common-flexCenterAlignCenter.ClanCommonStyle-buttonInvite.ClanProfileEditComponentStyle-buttonCancel>span{color:rgb(255,188,9)}.FriendListComponentStyle-containerButtonFriends>div>img{filter:sepia(700%) saturate(200%)}.Common-flexCenterAlignCenter.DialogContainerComponentStyle-enterButton>span{color:rgb(255,188,9)}.BasePaymentComponentStyle-buttonContainer>div>span{color:rgb(255,188,9)}.BattlePickComponentStyle-descriptionBattle h2{color:rgb(255,188,9)}.ContainersStyle-centerColumn>div>div>span{color:rgb(255,188,9)}.Common-flexCenterAlignCenter.PossibleRewardsStyle-buttonShowAll.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter.ContainersStyleMobile-buttonShowAll>span{color:rgb(255,188,9)}.TanksPartBaseComponentStyle-tankPartContainer>div>.TanksPartComponentStyle-descriptionContainer>div>div>.Common-flexCenterAlignCenter{border-radius:15px;border:2px solid rgba(255,255,255,0.22);transition:box-shadow 0.8s !important;box-shadow:unset !important}.TanksPartBaseComponentStyle-tankPartContainer>div>.TanksPartComponentStyle-descriptionContainer>div>div>div>div>.Common-flexCenterAlignCenter{border-radius:15px;border:2px solid rgba(255,255,255,0.2);transition:box-shadow 0.8s !important;box-shadow:unset !important}.TanksPartBaseComponentStyle-tankPartContainer>div>.TanksPartComponentStyle-descriptionContainer>div>div>div>div>.Common-flexCenterAlignCenter:hover{box-shadow:rgb(255,188,9) 0em 0em 0em 0.09em !important;background:rgb(0 0 0/100%)}.TanksPartBaseComponentStyle-tankPartContainer>div>.TanksPartComponentStyle-descriptionContainer>div>div>.Common-flexCenterAlignCenter:hover{box-shadow:rgb(255,188,9) 0em 0em 0em 0.09em !important;background:rgb(0 0 0/100%)}.DeviceButtonComponentStyle-blockAlterations h2{color:rgb(255,188,9)}.ItemDescriptionComponentStyle-linkToFullDescription{color:rgb(255,188,9)}.TanksPartComponentStyle-blockDescriptionComponent>span{color:rgb(255,188,9)}TutorialModalComponentStyle-contentWrapper>div>div>h1{color:rgb(255,188,9)}.Common-menuItemActive{position:absolute;bottom:0px;background-color:rgb(255 255 255)}.ContextMenuStyle-menuItemRank{background:rgb(255 255 255 / 10%);height:2.663em;border-radius:10px}.ContextMenuStyle-menuItemRank:hover{background:rgb(0 0 0 / 10%);height:2.663em;border-radius:10px}.navbar{background:rgb(0 0 0 / 40%);backdrop-filter:blur(5px);border-bottom-left-radius:30px;border-bottom-right-radius:30px;border:2px solid rgba(255,255,255,0.2)}.generic-box{background:rgb(0 0 0 / 30%);border-radius:15px;border:2px solid rgba(255,255,255,0.2);backdrop-filter:blur(5px)}.search-panel__input-wrapper>input{background:rgb(0 0 0 / 30%);border-radius:11px;border:2px solid rgba(255,255,255,0.2)}.my-favorites__itself{border-radius:10px;border:2px solid rgba(255,255,255,0.2);background:rgb(0 0 0 / 30%)}.generic-button{border-radius:10px;border:2px solid rgba(255,255,255,0.2);background:rgb(0 0 0 / 30%)}.generic-button:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.progress-bar{border-radius:12px;border:2px solid rgba(255,255,255,0.2);background:rgb(0 0 0 / 30%)}.generic-selector__itself{border-radius:10px;border:2px solid rgba(255,255,255,0.2);background:rgb(0 0 0 / 0%)}.progress-bar__bar{background:rgb(115 81 132 / 30%);border:2px solid rgba(255,255,255,0.2);border-radius:10px}.ClanStatisticsComponentStyle-marginLeftAreCommon{background:rgb(0 0 0 / 60%);border:2px solid rgba(255,255,255,0.22);border-radius:10px}.NotificationViewStyle-commonBlockNotification{background:rgb(0 0 0 / 20%) !important;border-bottom-left-radius:15px;border-top-left-radius:15px;backdrop-filter:blur(5px)}#invite{border-radius:12px;border:2px solid rgba(255,255,255,0.2);background:rgb(0 0 0 / 10%)}.client-button{background:rgb(0 0 0 / 10%);border:2px solid rgba(255,255,255,0.2);border-radius:12px}.client-button:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important;background:rgb(0 0 0 / 10%);border:0px solid rgba(255,255,255,0);margin:0px}.ClanStatisticsComponentStyle-areCommon{background:rgb(0 0 0 / 60%);border:2px solid rgba(255,255,255,0.2);border-radius:10px}.Common-backgroundImageCover.modeLimitIcon{transition:box-shadow 0.8s !important;box-shadow:unset !important;border:2px solid rgba(255,255,255,0.2);border-radius:10px}.Common-backgroundImageCover.modeLimitIcon:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexCenterAlignCenter.UserTitleComponentStyle-premiumButton{border-radius:12px;background:rgb(0 0 0 / 10%);border:2px solid rgba(255,255,255,0.2);transition:box-shadow 0.8s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.UserTitleComponentStyle-premiumButton:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.PopupMessageComponentStyle-buttonsContainer>.Common-flexCenterAlignCenter>div{border-radius:12px;background:rgb(0 0 0 / 10%);border:2px solid rgba(255,255,255,0.2);transition:box-shadow 0.8s !important;box-shadow:unset !important}.PopupMessageComponentStyle-buttonsContainer>.Common-flexCenterAlignCenter>div:hover{background:rgb(0 0 0 / 10%);box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-container.Common-flexStartAlignStartColumn,.BattleComponentStyle-canvasContainer>.Common-container{background:rgb(0,0,0,0.4)}.TableComponentStyle-tBody{backdrop-filter:blur(0px)}.ChallengeTimerComponentStyle-textTime{border-radius:25px;border:2px solid rgba(255,255,255,0.2);color:rgb(255 255 255/100%);background-color:rgb(0 0 0/0%)}.Common-flexCenterAlignCenterColumn.TierItemComponentStyle-getItemNow{background:rgba(0,128,0,0.3);border-radius:15px;border:2px solid rgba(255,255,255,0.2)}.TierItemComponentStyle-tierCommon{background:rgb(0 0 69/20%);border-radius:15px;border:2px solid rgba(255,255,255,0.2)}.Common-flexCenterAlignCenterColumn.TierItemComponentStyle-tierPremium{background:rgb(0 0 0/20%);border-radius:15px;border:2px solid rgba(255,255,255,0.2)}`;
})();