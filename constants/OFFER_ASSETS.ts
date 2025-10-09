import { type ClubKey } from "./Colors";

export const CLUB_LOGOS: Record<ClubKey, any> = {
    "hapoel-tel-aviv": require("../assets/offers/hapoel-tel-aviv/logo.png"),
    "maccabi-haifa": require("../assets/offers/maccabi-haifa/logo.png"),
  };
  
  export const OFFER_ASSETS: Record<
    ClubKey,
    {
      shirt: any;
      scarf: any;
      ticket: any;
      sponsor1: any;
      sponsor2: any;
      homeA?: any;
      homeB?: any;
      homeC?: any;
      shirt2?: any;
      shirt3?: any;
      shirt4?: any;
    }
  > = {
    "hapoel-tel-aviv": {
      shirt: require("../assets/offers/hapoel-tel-aviv/shirt.jpg"),
      scarf: require("../assets/offers/hapoel-tel-aviv/scarf.jpg"),
      ticket: require("../assets/offers/hapoel-tel-aviv/logo.png"),
      sponsor1: require("../assets/offers/hapoel-tel-aviv/sponser1.jpg"),
      sponsor2: require("../assets/offers/hapoel-tel-aviv/sponser2.webp"),
      // Optional: replace with real mockups if you have them
      homeA: require("../assets/offers/hapoel-tel-aviv/shirt.jpg"),
      homeB: require("../assets/offers/hapoel-tel-aviv/shirt.jpg"),
      homeC: require("../assets/offers/hapoel-tel-aviv/shirt.jpg"),
      shirt2: require("../assets/offers/hapoel-tel-aviv/shirt2.jpeg"),
      shirt3: require("../assets/offers/hapoel-tel-aviv/shirt3.jpeg"),
      shirt4: require("../assets/offers/hapoel-tel-aviv/shirt4.jpeg"),
    },
    "maccabi-haifa": {
      shirt: require("../assets/offers/maccabi-haifa/shirt.jpg"),
      shirt2: require("../assets/offers/maccabi-haifa/shirt2.jpeg"),
      shirt3: require("../assets/offers/maccabi-haifa/shirt3.jpeg"),
      shirt4: require("../assets/offers/maccabi-haifa/shirt4.jpeg"),
      scarf: require("../assets/offers/maccabi-haifa/scarf.png"),
      ticket: require("../assets/offers/maccabi-haifa/logo.png"),
      sponsor1: require("../assets/offers/maccabi-haifa/sponser1.png"),
      sponsor2: require("../assets/offers/maccabi-haifa/sponser2.png"),
      homeA: require("../assets/offers/maccabi-haifa/shirt.jpg"),
      homeB: require("../assets/offers/maccabi-haifa/shirt.jpg"),
      homeC: require("../assets/offers/maccabi-haifa/shirt.jpg"),
    },
  };
