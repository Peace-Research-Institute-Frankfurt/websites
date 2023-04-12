function awaitSelector(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector))
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector))
        observer.disconnect()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  })
}

function processVideoEmbeds(container) {
  const embeds = container.querySelectorAll(".embed-container")
  embeds.forEach((el) => {
    const iframe = el.querySelector("iframe[src*='video-stream-hosting.de']")
    if (iframe) {
      const src = iframe.getAttribute("src")
      const params = new URLSearchParams(src)

      let copyButton = el.querySelector(".eunpdctools_copy-markdown")
      if (!copyButton) {
        copyButton = document.createElement("button")
        copyButton.classList.add("eunpdctools_copy-markdown")
        el.insertAdjacentElement("beforeend", copyButton)
      }

      copyButton.innerText = `Copy MDX`
      copyButton.style.position = "absolute"
      copyButton.style.zIndex = 2000
      copyButton.style.top = "1rem"
      copyButton.style.left = "1rem"
      copyButton.style.display = "block"

      const markdown = `<LectureVideo smil="${params.get("smil")}" poster="${params.get("bgimage")}" subtitles="${params.get("untertitelDatei")}" provider="video-stream">[Your transcript here]</LectureVideo>`

      copyButton.addEventListener("click", (e) => {
        navigator.clipboard.writeText(markdown).then((value) => {
          console.log("Copied MDX to clipboard")
        })
      })
    }
  })
}

function init() {
  console.log("Running EUNPDC Utilities Plugin")

  const handleSlideChange = (mutationList, observer) => {
    console.log(mutationList)
    mutationList.forEach((el) => {
      const displayValue = window.getComputedStyle(el.target).getPropertyValue("display")
      if (displayValue === "block") {
        processVideoEmbeds(el.target)
      }
    })
  }

  const observer = new MutationObserver(handleSlideChange)

  console.log("Waiting for Lernbar to load...")

  awaitSelector(".widget-course").then((el) => {
    console.log("Lernbar loaded, registering MutationObserver...")
    const targetNodes = el.querySelectorAll(".widget-page")
    targetNodes.forEach((node) => {
      observer.observe(node, { attributes: true, childList: false, subtree: false })
    })
  })
}

init()
