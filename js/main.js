const text = `Равным образом рамки и место обучения кадров позволяет оценить значение позиций, занимаемых участниками в отношении поставленных задач. Равным образом постоянное информационно-пропагандистское обеспечение нашей деятельности влечет за собой процесс внедрения и модернизации дальнейших направлений развития.

Идейные соображения высшего порядка, а также начало повседневной работы по формированию позиции требуют от нас анализа дальнейших направлений развития. С другой стороны постоянный количественный рост и сфера нашей активности требуют от нас анализа соответствующий условий активизации. С другой стороны сложившаяся структура организации требуют определения и уточнения системы обучения кадров, соответствует насущным потребностям.

Не следует, однако забывать, что постоянный количественный рост и сфера нашей активности представляет собой интересный эксперимент проверки систем массового участия. С другой стороны реализация намеченных плановых заданий обеспечивает широкому кругу (специалистов) участие в формировании позиций, занимаемых участниками в отношении поставленных задач. Равным образом консультация с широким активом требуют от нас анализа соответствующий условий активизации. Товарищи! консультация с широким активом позволяет оценить значение существенных финансовых и административных условий. `;
const inputElement = document.querySelector("#input");
const textExampleElement = document.querySelector("#textExample");

const lines = getLines(text)

console.log(lines)

let letterId = 1

let startMoment = null
let started = false

let letterCounter = 0
let letterCounterError = 0

const isKeyPressed = event => ['Shift', 'Tab', 'AltGraph', 'Backspace', 'Enter','=','+', '.', ',', '\\'].includes(event.key)

init()

function init () {

    update()

    inputElement.focus()

    inputElement.addEventListener('keydown', function(event) {

        console.log(event)
        const currentLineNumber = getCurrentLineNumber()
        const currentLetter = getCurrentLetter()

        if (event.key !== 'Shift') {
            letterCounter = letterCounter + 1
        }
        
        if (!started) {
            started = true
            startMoment = Date.now()

        }

        if (isKeyPressed(event)) {
            key = event.code
        }
        else {
            key = event.key.toLowerCase()
        }

        

        const element = document.querySelector('[data-key="' + key + '"]')


    
        // Окрашиваем буквы в серый цвет

        if (event.key.startsWith('F') && event.key.length > 1) {
            return
        }
        
        if (element) {
            element.classList.add('hint')
        }
        
        console.log(event)
        console.log(element)
        
        // Проверяем введенный символ на соответствие тексту, если не соответствует не печатаем

        const isKey = event.key === currentLetter.original
        const isEnter = event.key === 'Enter' && currentLetter.original === '\n'

        if ( isKey || isEnter) {
            letterId = letterId + 1
            update()
        }
        else {

            event.preventDefault()

            if (event.key !== 'Shift') {
                letterCounterError = letterCounterError + 1
            
                for (const line of lines) {
                    for (const letter of line) {
                        if (letter.original === currentLetter.original){
                            letter.success = false
                        }
                        
                    }
                }
            }
            update()
        }
        
        if (currentLineNumber !== getCurrentLineNumber()) {
            inputElement.value = ''
            event.preventDefault()

            started = false

            const time = Date.now() - startMoment

            document.querySelector('#wordsSpeed').textContent = Math.round(letterCounter / (time / 60000))
            document.querySelector('#errorProcent').textContent = Math.floor(10000 * letterCounterError / letterCounter)/ 100 + ' %'
            
            
            letterCounter = 0
            letterCounterError = 0

        } 
    })

    inputElement.addEventListener('keyup', function(event) {

        
        if (isKeyPressed(event)) {
            key = event.code
        }
        else {
            key = event.key.toLowerCase()
        }

   
        const element = document.querySelector('[data-key="' + key + '"]')
        

        

        if (element) {
            element.classList.remove('hint')
        }
       
        console.log(event)
        console.log(element)
     
    })


}


// Принимает длинную строку, возвращает масив строк со служебной информацией

function getLines (text) {
    const lines = []

    let line = []
    let idCounter = 0
        for (const originalLetter of text){
            idCounter = idCounter + 1

            let letter = originalLetter
            
            if (letter === ' ') {
                letter = '°'
            }

            if (letter === '\n') {
                letter = '¶\n'
            }

           line.push({
               id:idCounter,
               label: letter,
               original: originalLetter,
               success: true
           }
           )
           if (line.length >=70 || letter === '¶\n'){
               lines.push(line)
               line = []
           }
        }

        if(line > 0){
            lines.push(line)
        }
    return lines
   
}


// Принимает строку с объектами со служебной информацией, 
// И возвращает html структуру

function lineToHtml (line) {

    const divElement = document.createElement('div')
    divElement.classList.add('line')

    for (const letter of line){
        const spanElement = document.createElement('span')
        spanElement.textContent = letter.label

        divElement.append(spanElement)

        if(letterId > letter.id){
            spanElement.classList.add('done')
        }
        else if (letter.success === false) {
            spanElement.classList.add('hint')
        }

    }
    return divElement
    
    
}
console.log(lineToHtml(lines[0]))




// Возвращает актуальный номер строки

function getCurrentLineNumber () {
    for(let i = 0; i < lines.length; i++){
        for(const letter of lines[i]){
            if(letter.id === letterId){
                return i
            }
        }
    }
}

console.log(getCurrentLineNumber())


// Функция обновления трех отображаемых сторк

function update () {

    const currentLineNumber = getCurrentLineNumber()

    textExampleElement.innerHTML = ''

   

    for(let i = 0; i < lines.length; i++) {
       const html = lineToHtml(lines[i])
       textExampleElement.append(html)

        if(i < currentLineNumber || i > currentLineNumber + 2){
            html.classList.add('hidden')
        }
    }
}

// Возвращае объект символа ожидаемый программой

function getCurrentLetter () {
    for(const line of lines) {
        for(const letter of line){
            if(letterId === letter.id){
                return letter
            }
        }
    }
        

}

console.log(getCurrentLetter())
