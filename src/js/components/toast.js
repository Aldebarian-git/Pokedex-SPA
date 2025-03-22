import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const toast = {
  init() {
    iziToast.settings({
      position: "topRight",
      timeout: 3000, 
      progressBar: false,
      animateInside: true,
      close: false,
      closeOnClick: true,      
      icon: "",
      layout: 2,
      messageColor: "#fff",
      messageSize: 16,
      maxWidth:600,
      imageWidth: 100,      
    });
  },

  success(message) {
    iziToast.success({      
      message: message,
      backgroundColor: "#22C55E",                   
      image: "/img/pikachu.png",
            

    });
  },
  error(message) {
    iziToast.error({      
      message: message,
      color: "#EF4444",
      image: "/img/pikachu_surprise.webp",
                  
    });
  },
  warning(message) {
    iziToast.warning({      
      message: message,
      color: "#F59E0B",
    });
  },
  info(message) {
    iziToast.info({
      title: "Information",
      message: message,
      color: "#0EA5E9",
    });
  },
};

export default toast;