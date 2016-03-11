/*
    Service that contains the user information and handles user interaction events such as
    Registering user with server
    Set username for game
*/
angular.module('myApp').factory('ColorService', function() {

    var colors = {
        blue: {
            dark: "#3A539B", // chambray
            primary: "#446CB3", // san marino
            highlight: "#59ABE3", // Picton Blue
            light: "#C5EFF7", // Humming bird
            health: {
                player: {
                    remaining: "#87D37C", // gossip
                    lost: "#90C695" // Dark sea grenn
                },
                base: {
                    lost: "#C5EFF7", // Humming bird
                    remaining: "#59ABE3", // Picton Blue
                }
            }
        },
        red: {
            dark: "#96281B", //old brick
            primary: "#D91E18", // thunderbrid
            highlight: "#E74C3C", //cinnabar
            health: {
                player: {
                    remaining: "#87D37C", // gossip
                    lost: "#90C695" // Dark sea grenn
                },
                base: {
                    lost: "#C5EFF7", // Humming bird
                    remaining: "#E74C3C", //cinnabar
                }
            }
        },

    };

    function getRedColors() {
        return colors.red;
    }

    function getBlueColors() {
        return colors.blue;
    }

    /* --------------------
        PUBLIC API
    ---------------- */

    return {
        getRedColors: getRedColors,
        getBlueColors: getBlueColors,        
    };

});