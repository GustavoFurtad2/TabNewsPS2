import { COLOR } from "./color.js"
import { getPosts, getPostContent } from "./api.js"

IOP.reset()
IOP.loadDefaultModule(IOP.pads)
IOP.loadDefaultModule(IOP.network)
Network.init()

Screen.log(JSON.stringify(Network.getConfig()))

const FONT = new Font("assets/fonts/Arial.ttf")
FONT.scale = 0.45

const SCREEN_WIDTH = 640
const SCREEN_HEIGHT = 448

const LOGO = new Image("assets/icons/logo.png")
LOGO.width = 22
LOGO.height = 16

let currentPosts = JSON.parse(getPosts(1, 10, "relevant"))
let selectedOption = 1
let totalOptions = currentPosts.length
let inPostsList = true
let loadedPostContent = {}
const maxCharsPerLine = 80

let PAD = Pads.get()
let OLDPAD = Pads.get()

function wrapText(content, maxChars) {

    let lines = []

    for (let i = 0; i < content.length; i += maxChars) {
        lines.push(content.substring(i, i + maxChars))
    }
    return lines
}

function showContent(content) {
    wrapText(content, maxCharsPerLine).forEach((line, i) => {
        FONT.print(55, 110 + i * 15, line)
    })
}

function loadPost(postIndex) {

    let post = currentPosts[postIndex]

    loadedPostContent = {
        ownerUsername: post.owner_username,
        tabcoins: post.tabcoins,
        title: post.title,
        slug: post.slug,
        content: JSON.parse(getPostContent(post.owner_username, post.slug)).body
    }
}

function updateCurrentPost() {

    if ((PAD.btns & Pads.CIRCLE) && !(OLDPAD.btns & Pads.CIRCLE)) {
        inPostsList = true
    }
}

function showCurrentPost() {

    FONT.color = COLOR.BLACK
    Draw.rect(43, 46, loadedPostContent.ownerUsername.length * 7, 18, COLOR.BLUE)

    FONT.color = COLOR.CYAN
    FONT.print(45, 37, loadedPostContent.ownerUsername)
    FONT.color = COLOR.BLACK
    FONT.print(45, 87, loadedPostContent.title)

    showContent(loadedPostContent.content)
}

function showPosts() {

    currentPosts.forEach((post, i) => {

        FONT.color = selectedOption === i + 1 ? COLOR.ORANGE : COLOR.BLACK
        FONT.print(45, 37 + i * 40, `${i + 1}.`)
        FONT.color = selectedOption === i + 1 ? COLOR.ORANGE : COLOR.GREY
        FONT.print(65, 37 + i * 40, post.title)
        FONT.print(65, 50 + i * 40, `${post.tabcoins} tabcoins · ${post.owner_username}`)
    });
}

function updateShowPosts() {

    if ((PAD.btns & Pads.CROSS) && !(OLDPAD.btns & Pads.CROSS)) {
        inPostsList = false
        loadPost(selectedOption - 1)
    } 
    else if ((PAD.btns & Pads.UP) && !(OLDPAD.btns & Pads.UP)) {
        selectedOption = selectedOption <= 1 ? totalOptions : selectedOption - 1
    } 
    else if ((PAD.btns & Pads.DOWN) && !(OLDPAD.btns & Pads.DOWN)) {
        selectedOption = selectedOption >= totalOptions ? 1 : selectedOption + 1
    }
}

function draw() {

    Draw.rect(0, 0, SCREEN_WIDTH, 35, COLOR.GREY)

    FONT.color = COLOR.WHITE
    FONT.print(45, 0, "TabNews")
    LOGO.draw(15, 10)

    if (inPostsList) {
        showPosts()
        updateShowPosts()
    } 
    else {
        showCurrentPost()
        updateCurrentPost()
    }
}

while (true) {
    Screen.clear(COLOR.WHITE)

    OLDPAD = PAD
    PAD = Pads.get()
    draw()

    let ramUsage = System.getMemoryStats()
    console.log(`FREE RAM: ${(32 - (ramUsage.used / 1048576).toFixed(2))}MB/32MB`)

    Screen.flip()
}

Network.deinit()