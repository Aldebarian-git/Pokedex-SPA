import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const toast = {
  init() {
    iziToast.settings({
      position: "topRight",
      timeout: 3000,                          
    });
  },

  success(message) {
    iziToast.success({      
      message: message,
      backgroundColor: "#22C55E",
      icon: "",
      messageColor: "#fff",
      maxWidth: 300,
      messageSize: 16, 
      layout: 2,
      image: "/img/pikachu.png",
      imageWidth: 140,      
      
    });
  },
  error(message) {
    iziToast.error({      
      message: message,
      color: "#EF4444",
      image: "/img/pikachu_surprise.webp",
      imageWidth: 140,
      icon: "",
      layout: 2,
      messageColor: "#fff",
      maxWidth: 300,
      messageSize: 16,
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