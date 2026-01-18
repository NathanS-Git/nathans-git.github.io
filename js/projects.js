// Project showcase interaction logic
// Adapted from album.js for cursor-following 3D effects

var prevTime = 0;

// This function creates the 3D cursor-following effect
function turnToMouse(element, event) {
    var time = (new Date()).getTime();

    // Make transition smoother upon entering
    if (time - prevTime <= 110) {
        element.style.transition = 'transform 0.1s';
    } else {
        element.style.transition = 'transform 0s';
    }

    mouseX = event.clientX;
    mouseY = event.clientY;

    element_data = element.getBoundingClientRect();
    center_x = (element_data.bottom - element_data.top) / 2;
    center_y = (element_data.right - element_data.left) / 2;
    y = -1 * (mouseY - ((center_x) + element_data.top));
    x = mouseX - ((center_y) + element_data.left);
    angle = Math.sqrt(x * x + y * y) / 12;

    // Apply 3D transform with translation
    element.style.transform = 'rotate3d(' + y + ',' + x + ',0,' + angle + 'deg) translate(' + x/40 + 'px,' + -y/40 + 'px)';
}

function mouseEnter() {
    var time = (new Date()).getTime();
    prevTime = time;
}

function mouseLeave(element) {
    element.style.transition = 'transform 1s';
}

function reset(element) {
    element.style.transform = 'rotate3d(0,0,0,0)';
}
