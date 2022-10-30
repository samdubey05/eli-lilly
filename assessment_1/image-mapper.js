console.log('hello')
let x = null
let y = null
let pointersArray = []
const loadFile = async (event) => {
	let image = document.getElementById('output')
    let dimensions = document.getElementById('dimensions')
    let imageName = document.getElementById('image-name')
    let type = document.getElementById('type')
	image.src = URL.createObjectURL(event.target.files[0])
    image.onload = function() {
        dimensions.innerText = this.width + 'x' + this.height
    }
    console.log(event.target.files[0], 'event.target.files[0]',)
    imageName.innerText = event.target.files[0].name
    type.innerText = event.target.files[0].type 
    document.getElementById('image-properties').style.display = 'block'
    console.log(document.querySelector("#output"))
}

const getImageSize = () => {
    console.log(document.querySelector("#output"))
    let myImg = document.querySelector("#output")
    console.log(myImg, 'myImg')
    let realWidth = myImg.clientWidth
    let realHeight = myImg.clientHeight
    console.log(realWidth, realHeight, 'realHeight')
}

const handleImageClick = (event) => {
    console.log(event, 'event')
    document.getElementById('dialog').style.display = 'block'
    document.getElementById('dialog').style.position = 'absolute'
    document.getElementById('dialog').style.top = `${event.y - 87}px`
    document.getElementById('dialog').style.left = `${event.x}px`
    x = event.x
    y = event.y
}
const handleClickSave = (event) => {
    console.log(document.getElementById("description-input").value)
    const descVal = document.getElementById("description-input").value
    // if no value is entered
    if(descVal == "") {
        console.log(descVal, 'descval')
        document.getElementById('dialog-alert').style.display = 'block'
    } else {
        document.getElementById('dialog-alert').display = 'none'
           // for adding the table contents
        pointersArray.push({xPos: x, yPos: y, description: descVal})
        console.log(pointersArray, 'pointersArray')
        
       
        document.getElementById("description-input").value = ''
        document.getElementById('table').style.display = 'table'
        const tableContainer =  document.getElementById('table')
        // new row
        const tr = document.createElement("tr");
        // col1
        const td1 = document.createElement("td");
        td1.innerText = x
        // col2
        const td2 = document.createElement("td");
        td2.innerText = y
        // col3
        const td3 = document.createElement("td");
        td3.innerText = descVal
        tr.appendChild(td1)
        tr.appendChild(td2)
        tr.appendChild(td3)
        tableContainer.appendChild(tr)

        // adding pointer
        // tooltip div with cordinates
        const imageContainer =  document.getElementById('image-container')
        const pointer = document.createElement('div')
        pointer.classList.add("tooltip")
        const hover = document.createElement('span')
        hover.innerText = descVal
        hover.classList.add("hover-tooltip");
        pointer.appendChild(hover)
        pointer.style.position = 'absolute'
        pointer.style.top = `${y - 89}px`
        pointer.style.left = `${x -10}px`
        pointer.style.background = `#b50f0f`
        pointer.style.width = `10px`
        pointer.style.height = `10px`
        pointer.style.borderRadius = `10px`
        document.getElementById('dialog').style.display = 'none'
        imageContainer.appendChild(pointer)
        x = null
        y = null
    }
   
}

const handleClickCancel = (event) => {
    document.getElementById('dialog').style.display = 'none'
    x = null
    y = null
    document.getElementById("description-input").value = ''
}

if(pointersArray.length) {
    
}