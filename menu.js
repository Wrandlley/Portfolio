
let btnMenu = document.getElementById('btn-menu')
let menu = document.getElementById('menu-mobile')
let overlay = document.querySelector('.overlay-menu')
let lastScrollY = window.scrollY
let desktopQuery = window.matchMedia('(min-width: 1376px)')

function setInitialMenuButton() {
    if (desktopQuery.matches) {
        btnMenu.classList.add('hidden')
    } else {
        btnMenu.classList.remove('hidden')
    }
}

setInitialMenuButton()

desktopQuery.addEventListener('change', setInitialMenuButton)

const desktopLinks = document.querySelectorAll('.menu-desktop a')
const mobileLinks = document.querySelectorAll('.menu-mobile nav ul li a')
const sections = document.querySelectorAll('main section[id]')

function clearActiveLinks() {
    desktopLinks.forEach(link => link.classList.remove('active'))
    mobileLinks.forEach(link => link.classList.remove('active'))
}

function setActiveLinkByHref(href) {
    clearActiveLinks()
    if (!href) return
    desktopLinks.forEach(link => {
        if (link.getAttribute('href') === href) {
            link.classList.add('active')
        }
    })
    mobileLinks.forEach(link => {
        if (link.getAttribute('href') === href) {
            link.classList.add('active')
        }
    })
}

function getCurrentSectionHash() {
    let currentHash = '#topo'
    sections.forEach(section => {
        const rect = section.getBoundingClientRect()
        if (rect.top <= window.innerHeight * 0.35 && rect.bottom > window.innerHeight * 0.15) {
            currentHash = `#${section.id}`
        }
    })
    return currentHash
}

function updateActiveLinkFromHash() {
    const hash = window.location.hash || '#topo'
    setActiveLinkByHref(hash)
}

function updateActiveLinkByScroll() {
    const hash = getCurrentSectionHash()
    setActiveLinkByHref(hash)
}

desktopLinks.forEach(link => {
    link.addEventListener('click', event => {
        setActiveLinkByHref(event.currentTarget.getAttribute('href'))
    })
})

mobileLinks.forEach(link => {
    link.addEventListener('click', event => {
        setActiveLinkByHref(event.currentTarget.getAttribute('href'))
        menu.classList.remove('abrir-menu')
    })
})

const contactForm = document.getElementById('contact-form')
const formStatus = document.querySelector('.form-status')

if (contactForm) {
    contactForm.addEventListener('submit', async event => {
        event.preventDefault()
        if (!formStatus) return

        const submitButton = contactForm.querySelector('button[type="submit"]')
        submitButton.disabled = true
        formStatus.textContent = 'Enviando mensagem...'
        formStatus.classList.remove('success', 'error')

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: {
                    'Accept': 'application/json'
                }
            })

            if (response.ok) {
                formStatus.textContent = 'Mensagem enviada com sucesso! Obrigado.'
                formStatus.classList.add('success')
                contactForm.reset()
            } else {
                const data = await response.json().catch(() => null)
                const message = data?.message || 'Erro ao enviar. Tente novamente mais tarde.'
                formStatus.textContent = message
                formStatus.classList.add('error')
            }
        } catch (error) {
            formStatus.textContent = 'Falha na conexão. Verifique sua internet e tente novamente.'
            formStatus.classList.add('error')
        } finally {
            submitButton.disabled = false
        }
    })
}

updateActiveLinkFromHash()
window.addEventListener('hashchange', updateActiveLinkFromHash)
window.addEventListener('scroll', updateActiveLinkByScroll)

btnMenu.addEventListener('click', () => {
    menu.classList.add('abrir-menu')
})

menu.addEventListener('click', () => {
    menu.classList.remove('abrir-menu')
})

overlay.addEventListener('click', () => {
    menu.classList.remove('abrir-menu')
})

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY
    if (!desktopQuery.matches) {
        lastScrollY = currentScrollY
        return
    }

    if (currentScrollY <= 10) {
        btnMenu.classList.add('hidden')
    } else if (currentScrollY > lastScrollY) {
        btnMenu.classList.remove('hidden')
    }

    lastScrollY = currentScrollY
})