let scrollY;
let wrap;

// 스크린 높이 계산
function syncHeight() {
  document.documentElement.style.setProperty(
    "--window-inner-height",
    `${window.innerHeight}px`
  );
}

// mobile check
function isMobile() {
  const width = window.innerWidth;
  if (width < 1025) {
    return true;
  }
  return false;
}

// body scroll lock
function bodyLock() {
  scrollY = window.scrollY;
  document.documentElement.classList.add("is-locked");
  document.documentElement.style.scrollBehavior = "auto";
  wrap.style.top = `-${scrollY}px`;
}

// body scroll unlock
function bodyUnlock() {
  document.documentElement.classList.remove("is-locked");

  window.scrollTo(0, scrollY);
  wrap.style.top = "";
  document.documentElement.style.scrollBehavior = "";
}

// popup open
function popOpen(id) {
  $("#" + id).fadeIn("fast");
  bodyLock();
}

// popup close
function popClose(obj) {
  $(obj).parents(".popup").fadeOut("fast");
  bodyUnlock();
}

// 🔹 페이지 처음 로드될 때 처리
let baseHref = "";
document.addEventListener("DOMContentLoaded", () => {
  baseHref = window.location.href.split("#")[0];
  wrap = document.querySelector(".wrap");
  syncHeight();
  // AOS.init();
  includehtml();
  const groupId = location.hash ? location.hash.replace("#", "") : "group1";
  selectImg(groupId);
  $(".btn-tip").click(function () {
    $(this).toggleClass("on");
  });
  $(document).on("click", function (event) {
    // 특정 영역 선택 (예: #targetElement)
    if (!$(event.target).closest(".tip-area").length) {
      const group = location.hash;
      const tipBtn = $(group).find(".btn-tip");
      if ($(tipBtn).hasClass("on")) {
        $(tipBtn).removeClass("on");
      }
    }
  });

  $("[id^=open-modal]").click(function () {
    var modalId = this.id.replace("open-", "");
    $("#" + modalId).show();

    var video = $("#" + modalId)
      .find(video)
      .get(0);
    if (video) {
      video.currentTime = 0;
      video.play();
    }
  });

  // 닫기 버튼 또는 배경 클릭 시
  $(".close").click(function () {
    $(".modal").hide();
    var video = $(this).next().get(0);
    video.pause();
  });
  // 🔹 모달 바깥 클릭 시 닫기
  $(document).on("click", ".modal", function (e) {
    // 클릭한 영역이 .modal-content 내부가 아닐 경우만 닫기
    if (!$(e.target).closest(".modal-content").length) {
      $(this).hide();

      // 비디오 정지
      var video = $(this).find("video").get(0);
      if (video) video.pause();
    }
  });
});

// 🔹 뒤로가기 / 앞으로가기 시 처리

window.addEventListener("hashchange", () => {
  const groupId = location.hash ? location.hash.replace("#", "") : "group1";
  selectImg(groupId);
});

// 🔹 버튼에서 직접 호출 시
function changeHash() {
  const currentHref = window.location.href;
  const currentHash = location.hash ? location.hash.replace("#", "") : "group1";
  console.log(currentHash);
  // 현재 페이지 전체 URL이 이전과 다르면 group1으로 이동
  if (currentHash !== "group1") {
    if (currentHref !== baseHref) {
      history.back();
    } else {
      selectImg("group1");
    }
  } else {
    alert("이전 페이지가 없습니다.");
  }
}
window.addEventListener("resize", () => {
  syncHeight();
});

window.addEventListener("scroll", () => {});

function includehtml() {
  var allElements = document.querySelectorAll("[data-include-path]");
  Array.prototype.forEach.call(allElements, function (el) {
    var includePath = el.dataset.includePath;
    var secId = el.id;
    if (includePath) {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          //el.outerHTML = this.responseText;
          el.innerHTML = this.responseText;
          el.removeAttribute("data-include-path");
        }
      };
      xhttp.open("GET", includePath, false);
      xhttp.send();
    }
  });
}

// 상위메뉴 접힘 펼침
function toggleGroup(_id) {
  var element = document.getElementById(_id);
  if (element) {
    element.classList.toggle("d-none");
    element.parentElement.classList.toggle("active");
  }
}

// 컨텐츠 이미지
function selectImg(targetId) {
  const secLists = document.querySelectorAll(".container section");
  secLists.forEach((secList, idx) => {
    const isTarget = secList.id === targetId;
    if (isTarget) {
      if (secList.classList.contains("d-none")) {
        location.hash = targetId;
        updateDepthState(idx);
      }
      secList.classList.remove("d-none");
    } else {
      secList.classList.add("d-none");
    }
  });
}

function updateDepthState(activeIndex) {
  const depthItems = document.querySelectorAll(".nav .depth02 li");
  depthItems.forEach((item, idx) => {
    const depth02 = item.closest(".depth02");
    let depth01 = depth02.parentElement;
    if (idx === activeIndex) {
      item.classList.add("active");
      depth02.classList.remove("d-none");
      depth01.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}
