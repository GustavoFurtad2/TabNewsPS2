import { COLOR } from "./color.js"
import { getPosts, getPostContent } from "./api.js";

IOP.reset();

IOP.loadDefaultModule(IOP.pads)
IOP.loadDefaultModule(IOP.network);

Network.init();

Screen.log(JSON.stringify(Network.getConfig()));

const FONT = new Font("assets/fonts/Arial.ttf")

const SCREEN_WIDTH = 640
const SCREEN_HEIGHT = 448

let LOGO = new Image("assets/icons/logo.png")
LOGO.width = 22
LOGO.height = 16

let currentPosts = JSON.parse(getPosts(1, 10, "relevant"))

let selectedOption = 1
let totalOptions = currentPosts.length

let inPostsList = true

FONT.scale = 0.45

let loadedPostContent = {}

const maxCharsPerLine = 80;

function showContent(content) {

    let lines = [];

    for (let i = 0; i < content.length; i += maxCharsPerLine) {
        lines.push(content.substring(i, i + maxCharsPerLine));
    }

    for (let i = 0; i < lines.length; i++) {
        FONT.print(55, 110 + i * 15, lines[i]);
    }
}

function loadPost(postIndex) {

    let post = currentPosts[postIndex]

    loadedPostContent.ownerUsername = post.owner_username
    loadedPostContent.tabcoins = post.tabcoins
    loadedPostContent.title = post.title
    loadedPostContent.slug = post.slug

    loadedPostContent.content = JSON.parse(getPostContent(loadedPostContent.ownerUsername, loadedPostContent.slug)).body
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
    FONT.print(45, 37, `${loadedPostContent.ownerUsername}`)
    FONT.color = COLOR.BLACK
    FONT.print(45, 87, `${loadedPostContent.title}`)

    showContent(loadedPostContent.content)
}


function showPosts() {

    for (let i = 0; i < currentPosts.length; i++) {

        const POST = currentPosts[i]

        FONT.color = COLOR.BLACK

        if (selectedOption == i + 1) {
            FONT.color = COLOR.ORANGE
            FONT.print(45, 37 + (i * 40), `${i + 1}.`)
            FONT.print(65, 37 + (i * 40), POST.title)
            FONT.print(65, 50 + (i * 40), `${POST.tabcoins} tabcoins · ${POST.owner_username}`)
        }
        else {

            FONT.print(45, 37 + (i * 40), `${i + 1}.`)
            FONT.color = COLOR.GREY
            FONT.print(65, 37 + (i * 40), POST.title)

            FONT.print(65, 50 + (i * 40), `${POST.tabcoins} tabcoins · ${POST.owner_username}`)      
        }
    }
}

let PAD = Pads.get()
let OLDPAD = Pads.get()

function updateShowPosts() {

    if ((PAD.btns & Pads.CROSS) && !(OLDPAD.btns & Pads.CROSS)) {
        inPostsList = false
        loadPost(selectedOption - 1)
    }
    else if ((PAD.btns & Pads.UP) && !(OLDPAD.btns & Pads.UP)) {

        selectedOption--

        if (selectedOption <= 0) {
            selectedOption = totalOptions
        }
    }
    else if ((PAD.btns & Pads.DOWN) && !(OLDPAD.btns & Pads.DOWN)) {

        selectedOption++

        if (selectedOption > totalOptions) {
            selectedOption = 1
        }
    }
}

function draw() {

    Draw.rect(0, 0, SCREEN_WIDTH, 35, COLOR.GREY)

    FONT.color = COLOR.WHITE
    FONT.print(45, 0, "TabNews")

    if (inPostsList) {

        showPosts()

        updateShowPosts()
    }
    else {

        showCurrentPost()

        updateCurrentPost()
    }

    LOGO.draw(15, 10)
}

var ram_usage = System.getMemoryStats()


while (true) {

    Screen.clear(COLOR.WHITE)

    OLDPAD = PAD
    PAD = Pads.get()

    draw()

    ram_usage = System.getMemoryStats();

    const ramUse = (ram_usage.used / 1048576).toFixed(2)
    console.log("FREE RAM: " + (32 - ramUse) + "MB/32MB");

    Screen.flip()
}

Network.deinit()