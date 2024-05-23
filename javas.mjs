import IMask from "imask";

document.querySelectorAll('a').forEach((element) => {
    if (!element.href.startsWith('#')){
        return
    }
    const href = element.href.split('#').at(-1)
    if (!href) return

    const targetElement = document.querySelector("#" + href)
    if (!targetElement) return

    element.addEventListener('click', (event) => {
        event.preventDefault()
        targetElement.scrollIntoView()
    })
})

document.querySelectorAll('.question').forEach((el) => {
    el.addEventListener('click', () => {
        const content = el.querySelector('.content')
        const height = content.style.maxHeight
        const plusIcon = el.querySelector('.lucide')

        document.querySelectorAll('.lucide').forEach((el) => {
            if (el !== plusIcon) {
                el.classList.remove('rotated')
            }
        })

        document.querySelectorAll('.content').forEach((el) => el.style.maxHeight = null)
        plusIcon.classList.toggle('rotated')
        content.style.maxHeight = !height ? content.scrollHeight + "px" : null
    })
})

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form')
    form.addEventListener('submit', formSend);

    async function formSend(el) {
        el.preventDefault();

        const {isValid, data} = formValidate(form);

        if (isValid) {
            const button = form.querySelector('#send-button')
            const buttonText = button.textContent

            button.disabled = true
            button.textContent = "Отправляется..."
            button.classList.remove('error')

            const reqBody = {
                email: data.mail,
                phone: data.number.match(/\d/g).join(''),
                name: data.username,
            }


            fetch('/api/request', {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify(reqBody)
            })
                .then((res) => res.json())
                .then(() => {
                    button.textContent = 'Отправлено'
                    form.reset()
                    setTimeout(() =>{
                        button.textContent = buttonText
                        button.disabled = false
                    }, 3000)
                })
                .catch(() => {
                    button.textContent = 'Ошибка отправки...'
                    button.classList.add('error')
                    button.disabled = false
                })
        }
    }

    function formValidate(form) {
        let error = 0;
        const inputs = form.querySelectorAll('input');
        const data = {}

        inputs.forEach((input) => {
            formRemoveError(input);

            if (input.classList.contains('_req') && input.value === "") {
                formAddError(input);
                error++;
            }

            data[input.name] = input.value
        })

        return {isValid: error === 0, data}
    }

    function formAddError(input) {
        input.classList.add('_error');
    }

    function formRemoveError(input) {
        input.classList.remove('_error');
    }

    let element = document.querySelector('.phone');
    let maskOptions = {
        mask: '+7(000)000-00-00',
        lazy: true
    };

    let mask = new IMask(element, maskOptions);
});
