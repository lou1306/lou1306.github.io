var notes = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"]

var transpose = function(s, note=0) {
        return s.map(function(n) {
            return (n + note) % 12
        })
    }

var scales = {
    major: [0, 2, 4, 5, 7, 9, 11],
    pentatonic: [0, 2, 4, 7, 9],

    grade: function(note, first){
        return (first + note) % 12
    }
}

var chords = {
    major: [0, 4, 7],
    minor: [0, 3, 7],
    maj7: [0, 4, 7, 11],
    min7: [0, 3, 7, 10],
    seventh: [0, 4, 7, 10],
    min7b5: [0, 3, 6, 10],
    dim:    [0, 3, 5, 11],

    aliases: {
        min: "minor",
        m: "minor",
        M: "major",
        "7": "seventh",
        dim: "dim",
        min7: "min7",
        m7: "min7",
        maj7: "maj7",
        M7: "maj7",
        min7b5: "min7b5",
        m7b5: "min7b5"
    },

    parse: function(s) {
        regex = /([A-G][#b]?)(.*)?/
        result = regex.exec(s)
        if (!result) {
            return null
        }
        else if (!result[2]) {
            console.log(result[1])
            chord = chords.major
        }
        else {
            if (chords.aliases.hasOwnProperty(result[2])) {
                chord = chords[chords.aliases[result[2]]]
            }
            else {
                return null
            }
        }
        return transpose(chord, notes.indexOf(result[1]))
    }
}

var tunings = {
    standard: [ 7, 2, 10, 5, 0, 7 ], // EBGDAE
    dropD: [ 7, 2, 10, 5, 0, 5 ] // EBGDAD
}

var guitar = {
    //notes: ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"],

    note: 3,
    tuning: tunings.standard,
    scale: scales.major,

    setNote: function(n){
        guitar.note = parseInt(n)
        guitar.show()
    },
    setFrets: function(n){
        // TODO: make setFrets great again
        if (n === "12") {
            $(".f24").hide()
        }
        else {
            $(".f24").show()   
        }
    },


    show: function(highlight = null) {
        s = transpose(guitar.scale, guitar.note)           
        $(".string").children().text("").removeClass("highlight")
        $(".string").each(function (index) {
            var openNote = guitar.tuning[index]
            $(this).find(".open-note").text(notes[openNote])
            $(this).find("td:not(.open-note)").each(
                function(i){
                    current = (openNote+1+i) % 12
                    if (s.indexOf(current) != -1) {
                        $(this).text(notes[current]);
                    }
                    if (highlight && highlight.indexOf(current) != -1) {
                        $(this).addClass("highlight")
                    }
                }
            )
        })
    }
}

var page = {
    init: function(){
        guitar.setNote(3)
        $("#note-select").val(3).change(function() {
            guitar.setNote($(this).val())
        })
        $("#frets-select").val(24).change(function() {
            guitar.setFrets($(this).val())
        })
        $("#highlight-txt").keypress(function(e) {
            if (e.which == 13) {
                hl = chords.parse($(this).val())
                guitar.show(hl)
                if (!hl) { $("#msg").text(":(") }
                else { $("#msg").text($(this).val()) }
            }
        })
    }
};

$(document).ready(function() {
    page.init()
});