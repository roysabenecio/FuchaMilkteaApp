export const abbvMeasureUnit = (uom) => {
    switch (uom) {
        case "Kilograms":
            return "kg" ;
        case "Grams":
            return "g";
        case "Liters":
            return "L";
        case "Mililiters":
            return "mL";
        case "Pieces":
            return "pcs";
        case "Can":
            return "can";
        case "Pack":
            return "pk";
        case "Bottle":
            return "btl";
    };
};