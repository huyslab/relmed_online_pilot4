// Instructions for the PLT
const small_coin_size = 60;

function prepare_instructions() {
    let inst =  [
        {
        type: jsPsychInstructions,
        css_classes: ['instructions'],
        pages: [
            `<p><b>THE CARD CHOOSING GAME</b></p>
                <p>In this game you are the owner of a safe.</p>
                <img src='imgs/safe.png' style='width:100px; height:100px;'>
                <p>At the start of the game, your safe contains:</p>
                <div style='display: grid'><table><tr><td><img src='imgs/1pound.png' style='width:${small_coin_size}px; height:${small_coin_size}px;'></td>
                <td><img src='imgs/50pence.png' style='width:${small_coin_size}px; height:${small_coin_size}px;'</td>
                <td><img src='imgs/1penny.png' style='width:${small_coin_size}px; height:${small_coin_size}px;'></td></tr>
                <tr><td>52x one pound coins</td><td>52x fifty pence coins</td><td>52x one penny coins</td></tr></table></div>
                <p>At the end of the game, you will draw one coin from your safe, and that will be your bonus payment.</p>
                <p>Your goal is to add coins to your safe while avoid losing coins already in it.</p>`,
            `<p>On each turn of this game, you will see two cards.
                You have three seconds to flip one of the two cards.</p>
                <p>This will reveal the coin you collect: either 1 pound, 50 pence, or 1 penny.</p>
                <div style='display: grid;'><table style='width: 200px; grid-column: 2;'><tr><td><img src='imgs/1penny.png' style='width:${small_coin_size}px; height:${small_coin_size}px;'></td>
                <td><img src='imgs/50pence.png' style='width:${small_coin_size}px; height:${small_coin_size}px;'></td>
                <td><img src='imgs/1pound.png' style='width:${small_coin_size}px; height:${small_coin_size}px;'></td></tr></table></div>`
        ],
        show_clickable_nav: true,
        data: {trialphase: "instruction"}
    },
    {
        type: jsPsychInstructions,
        css_classes: ['instructions'],
        pages: [
            "<p>If you see broken coins like these:</p>\
                    <img src='1pennybroken.png' style='width:${small_coin_size}px; height:${small_coin_size}px; position:absolute; right: 35%; top: 60%;'>\
                    <img src='50pencebroken.png' style='width:${small_coin_size}px; height:${small_coin_size}px; position:absolute; right: 50%; top: 60%;'>\
                    <img src='1poundbroken.png' style='width:${small_coin_size}px; height:${small_coin_size}px; position:absolute; right: 65%; top: 60%;'>\
                    <p>This means that a coin of that value in your safe was broken and removed.</p>"
        ],
        show_clickable_nav: true,
        data: {trialphase: "instruction"}
    },
    {
        type: jsPsychHtmlKeyboardResponse,
        css_classes: ['instructions'],
        stimulus: "<p>You choose a card by pressing the left or the right arrow keys. \
                <p>Let's try it out now!</p>",
        choices: ['arrowleft', 'arrowright'],
        data: {trialphase: "instruction"}
    }];

    inst.push(
        {
            timeline: build_PLT_task(
                [[
                    {
                        stimulus_left: "binoculars.png",
                        stimulus_right: "clock.png",
                        feedback_left: 1,
                        feedback_right: 1,
                        optimal_right: 1,
                        block: "practice1",
                        trial: 1,
                        valence: 1,
                        maxRespTime: -1
                    }
                ]],
                false
            )
        }
    );
        
  
    inst = inst.concat([{
        type: jsPsychInstructions,
        css_classes: ['instructions'],
        pages: [
            "<p>Some cards are better than others, but even good cards can sometimes only give a penny \
            <p>or might sometimes break a 1 pound coin.</p>\
            <p>All the coins you collect go in your safe.</p>"
        ],
        show_clickable_nav: true,
        data: {trialphase: "instruction"}
    },
    {
        type: jsPsychHtmlKeyboardResponse,
        css_classes: ['instructions'],
        stimulus: "<p>Let's practice both versions. We'll start with winning coins. \
            You begin with zero coins. Try to collect as many as you can.</p>\
            <p>Place your fingers on the left and right arrow keys, and press either one to start practicing.</p>",
        choices: ['arrowleft', 'arrowright'],
        data: {trialphase: "instruction"}
    }]);

    let dumbbell_on_right = [true, true, false, true, false, false];
    let reward_magnitude = [0.5, 1, 1, 0.5, 1, 0.5];

    inst.push(
        {
            timeline: build_PLT_task(
                [
                    dumbbell_on_right.map((e, i) => 
                        ({
                            stimulus_left: e ? "flashlight.png" : "dumbbell.png",
                            stimulus_right: e ? "dumbbell.png" : "flashlight.png",
                            feedback_left: e ? 0.01 : reward_magnitude[i],
                            feedback_right: e ? reward_magnitude[i] : 0.01,
                            optimal_right: e,
                            block: "practice2",
                            trial: i,
                            valence: 1
                        })
                    )
                ],
                false
            )
        }
    )


    inst = inst.concat([
        {
            type: jsPsychInstructions,
            css_classes: ['instructions'],
            pages: function() {
                let earnings = Math.round(jsPsych.data.get().filter({
                    block: "practice2", 
                    trial_type: "PLT"
                }).last(6).select('chosenOutcome').sum() * 1000) / 1000
    
                return ["<p>Well done! You would have earned £" + earnings + " in this game.</p>"]
            },
            show_clickable_nav: true,
            data: {trialphase: "instructions"}
        },
        {
            type: jsPsychHtmlKeyboardResponse,
            css_classes: ['instructions'],
            stimulus: "<p>Now, let's practice avoiding losses. You'll start with £6 in coins. Try to lose as few as possible.</p>\
                <p>Place your fingers on the left and right arrow keys, and press either one to start practicing.</p>",
            choices: ['arrowright', 'arrowleft'],
            data: {trialphase: "instruction"}
        }
    ]);

    let hammer_on_right = [false, true, false, true, false, false];
    let punishment_magnitude = [-0.01, -0.5, -0.5, -0.01, -0.01, -0.5];

    inst.push(
        {
            timeline: build_PLT_task(
                [
                    hammer_on_right.map((e, i) => 
                        ({
                            stimulus_left: e ? "tricycle.png" : "hammer.png",
                            stimulus_right: e ? "hammer.png" : "tricycle.png",
                            feedback_left: e ? -1 : punishment_magnitude[i],
                            feedback_right: e ? punishment_magnitude[i] : -1,
                            optimal_right: e,
                            block: "practice3",
                            trial: i,
                            valence: -1
                        })
                    )
                ],
                false
            )
        }
    );

    inst = inst.concat(
        [
        {
            type: jsPsychInstructions,
            css_classes: ['instructions'],
            pages: function() {
                let losses = jsPsych.data.get().filter({
                    block: "practice3", 
                    trial_type: "PLT"
                }).last(6).select('chosenOutcome').sum();

                let earnings = Math.round((6 + losses) * 1000) / 1000

                let pages = [
                    "<p>Well done!</><p>You would have lost £" +  Math.round(Math.abs(losses) * 1000) / 1000 +
                    " in coins in this game, leaving £" + earnings + " in your purse.</p>"
                ];
        
                if (window.earlyStop) {
                    pages.push("<p>To save time in the real game, if you select the better card five times in a row, \
                the game will end, and you will get all the remaining coins as if you \
                had chosen the better card each time.</p>");
                }
        
                let penultimate_pate = "<p>You are almost ready to play for real.</p>\
                    <p>You will play multiple rounds of The Card Collector's Challenge. ";
                
                if (window.valenceGrouped){
                    if (window.rewardFirst){
                        penultimate_pate += "At first you'll play " +  window.totalBlockNumber / 2 + 
                            " rounds to win coins, and then another " +  window.totalBlockNumber / 2 + 
                            " rounds to avoid losing coins.</p>";
                    } else {
                        penultimate_pate += "At first you'll play " +  window.totalBlockNumber / 2 + 
                            " rounds to avoid losing coins, and then another " +  window.totalBlockNumber / 2 + 
                            " rounds to win coins. You start the game with £114 of coins.</p>";
                    }
                } else {
                    penultimate_pate += "You will play  " +  window.totalBlockNumber  + 
                            " rounds, sometimes to win coins, and sometimes to avoid losing them.<br>\
                            You start the game with £114 of coins. ";
                }
                
                pages.push(penultimate_pate);

                pages.push(
                    `<p>Before you being the challenge, we will ask you to answer a few questions about the instructions you have just read.</p>
                    <p>You must answer all questions correctly to begin the challenge</p>\
                    <p>Otherwise, you can repeat the instructions and try again.</p>`
                )
        
                return(pages)
            },
            show_clickable_nav: true,
            data: {trialphase: "instructions"}
        }
    ]);

    let quiz_questions = [
        {
            prompt: "If I find a broken coin, that means it will be removed from my purse.",
            options: ["True", "False"],
            required: true
        },
        {
            prompt: "My goal is to collect as many high-value coins as I can.",
            options: ["True", "False"],
            required: true
        },
    ];

    if (window.valenceGrouped){
        if (window.rewardFirst){
            quiz_questions.push(
                {
                    prompt: "I will first play 12 rounds to win coins, and then 12 rounds to avoid losing coins.",
                    options: ["True", "False"],
                    required: true
                }
            );
        }else{
            quiz_questions.push(
                {
                    prompt: "I will first play 12 rounds to avoid losing coins, and then 12 rounds to win coins.",
                    options: ["True", "False"],
                    required: true
                }
            );
        }
    }else{
        quiz_questions.push(
            {
                prompt: "I will sometimes play to win coins, and sometimes to avoid losing coins.",
                options: ["True", "False"],
                required: true
            }
        );
    }

    inst.push(
        {
            type: jsPsychSurveyMultiChoice,
            questions: quiz_questions,
            preamble: `<div class=instuctions><p>For each statement, please indicate whether it is true or false:</p></div>`,
            data: {
                trialphase: "instruction_quiz"
            },
            simulation_options: {
                data: {
                    response: {
                        Q0: `True`,
                        Q1: `True`,
                        Q2: `True`,
                    }
                }
            }   
        }
    );

    inst.push(
        {
            type: jsPsychInstructions,
            css_classes: ['instructions'],
            timeline: [
                {
                    pages: [
                    `<p>You did not answer all the quiz questions correctly. 
                    Please read the instructions again before you continue</p>`
                    ]
                }
            ],
            conditional_function: check_quiz_failed,
            show_clickable_nav: true,
            data: {
                trialphase: "quiz_failure"
            }
        }
    );

    inst_loop = {
        timeline: inst,
        loop_function: check_quiz_failed
    }

    return inst_loop
} 

function check_quiz_failed() {
    const data = jsPsych.data.get().filter({trialphase: "instruction_quiz"}).last(1).select('response').values[0];
    console.log(data)
    return !Object.values(data).every(value => value === "True");
}

const lottery_instructions = {
    type: jsPsychInstructions,
    css_classes: ['instructions'],
    pages: [
        '<p>You have completed the Card Collector Challenge!</p>\
            <p>Next, your bonus payment will be determined.</p>\
            <p>On the next page, you will be presented with a representative sample of the coins \
            you have collected during the challenge. The Card Collector will hide the coins behind cards and \
            shuffle them. You will then be able to chose one card, to reveal the coin that will be paid to you as a bonus.</p> '
    ],
    show_clickable_nav: true,
    data: {trialphase: "lottery_instructions"}
}