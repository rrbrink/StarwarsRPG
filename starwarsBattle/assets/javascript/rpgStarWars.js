// Execute this code when the DOM has fully loaded.
$(document).ready(function() {
  var characters = {
    "Obi-Wan Kenobi": {
      name: "Obi-Wan Kenobi",
      health: 120,
      attack: 8,
      imageUrl: "assets/images/obi-wan.jpg",
      enemyAttackBack: 15
    },
    "Luke Skywalker": {
      name: "Luke Skywalker",
      health: 100,
      attack: 14,
      imageUrl: "assets/images/luke-skywalker.jpg",
      enemyAttackBack: 5
    },
    "Darth Sidious": {
      name: "Darth Sidious",
      health: 150,
      attack: 8,
      imageUrl: "assets/images/darth-sidious.png",
      enemyAttackBack: 20
    },
    "Darth Maul": {
      name: "Darth Maul",
      health: 180,
      attack: 7,
      imageUrl: "assets/images/darth-maul.jpg",
      enemyAttackBack: 25
    }
  };

  //When the game starts, the player will choose a character by clicking on the fighter's picture. The player will fight as that character for the rest of the game.

    //us (this is our guy);
    var us;
    //openents
    var opponents = [];
    //enemy (this is our enemy out of the oppennts array)
    var enemy;
    //keep track of how many turns there are
    var turnCounter = 1;
    //to keep tack of how many we have killed
    var killCount = 0;
  //The player chooses an opponent by clicking on an enemy's picture.

  //choose a charictor
  function renderCharacter (character, renderArea) {
    var charDiv = $("<div class='character' data-name='" + character.name + "'>");
    //show the charictor's name
    var charName = $("<div class='character-name'>").text(character.name);
    //show the picture of the charictor
    var charImage = $("<img alt='starwars-img' class='character-image'>").attr("src", character.imageUrl);
    //show their health
    var charHealth = $("<div class='character-health'>").text(character.health);
    //put stuff inside of our charDiv
    charDiv.append(charName).append(charImage).append(charHealth);
    //show your charictor div on our html page
    $(renderArea).append(charDiv)
  }

  //function to start the game and render charictors
  function startGame() {
    for (var i in characters ) {
      console.log(characters[i]);
      renderCharacter(characters[i], "#characters-section"  )
    }
  }
  startGame()
  //renderMessage
    function renderMessage(message) {
      // Builds the message and appends it to the page.
      var gameMessageSet = $("#game-message");
      var newMessage = $("<div>").text(message);
      gameMessageSet.append(newMessage);
    };

  //this is to render our charictor
  function updateCharacter (charObj, areaRender) {
  // First we empty the area so that we can re-render the new object
    $(areaRender).empty();
    renderCharacter(charObj, areaRender);
  };

  //this is to render our ennemeis
  function renderEnemies(enemyArr) {
    for (var i = 0; i < enemyArr.length; i++) {
      renderCharacter(enemyArr[i], '#available-to-attack-section')
    }
  }

  //
  function clearMessage() {
    var gameMessage = $("#game-message");

    gameMessage.text("");
  };

  function restartGame(resultMessage) {
    // When the 'Restart' button is clicked, reload the page.
    var restart = $("<button>Restart</button>").click(function() {
      location.reload();
    });

    // Build div that will display the victory/defeat message.
    var gameState = $("<div>").text(resultMessage);

    // Render the restart button and victory/defeat message to the page.
    $("body").append(gameState);
    $("body").append(restart);
  };

  //The player will now be able to click the attack button.
  $("#characters-section").on('click', '.character', function () {
    //save the name of the charictor we clicked on

    var name = $(this).attr("data-name");

    if (!us) {
      //this is the char we want to play as

      us = characters[name]

      //take all remaining cahrs and make them enemies

      for (var i in characters) {
        if (i !== name) {

          opponents.push(characters[i])

        }
      }
      //hide unselected charictors
      $("#characters-section").hide();
      updateCharacter(us, "#selected-character");
      renderEnemies(opponents);

      console.log(opponents, us);
    }
  })
  //once the player selects an opponent, that enemy is moved to a defender area.
  $('#available-to-attack-section').on('click', '.character', function() {
    //save the oppenents name
    var name = $(this).attr("data-name");
    //if there is no defender, the clicked enemy will become the defender
    if ($("#defender").children().length === 0) {
      //chose our enemy
      enemy = characters[name]
      //render them to the dom
      updateCharacter(enemy, '#defender')
      //remove element(old oppnent) as it will now be our defender
      $(this).remove()
      //make function that says who we're atacking and their attack damge
      clearMessage()
    }
  });
  $('#attack-button').on( 'click', function () {
    //if there is a defender, combat happens
    if($("#defender").children().length !== 0){
      //create a messege for our attack and oppoints counter attack
      var attackMessage = "You attacked " + enemy.name + " for " + us.attack * turnCounter + " damage.";
      var counterAttackMessage = enemy.name + " attacked you back for " + enemy.enemyAttackBack + " damage.";
      //reduce defenders health by our attack
      enemy.health -= (us.attack * turnCounter);
      //if the enemy still has health
      if (enemy.health > 0 ) {
        // render the enemys updated stuff
        updateCharacter(enemy, "#defender");
        // render combat message
        renderMessage(attackMessage)
        renderMessage(counterAttackMessage)
        //reduce our health by oppents attack
        us.health -= enemy.enemyAttackBack;
        ////render our updated stuff
        updateCharacter(us, "#selected-character");
        //if we dont have helth then the game ends
        if (us.health <= 0) {
          clearMessage()
          //restart button apears we can paly game again
          restartGame("You have been defeated...GAME OVER!!!")
          $('#attack-button').off("click");
        }
      }
      else {
        //if the enemy has less then zero health they lost
        //remove their card
        $('#defender').empty();
        var gameStateMessage = "You have defeated " + enemy.name + ", you can choose to fight another enemy.";
        renderMessage(gameStateMessage);
        //increment kill counter
        killCount = killCount + 1;
        //if our killcount is greater then the length of the opponents array
        if (killCount >= opponents.length) {
          clearMessage();
          $('#attack-button').off("click");
        }
        //restartGame and play again
        restartGame("You won suckka")
      }
      turnCounter++;
    }else {
      clearMessage();
      renderMessage("need to select enemy punk")
    }
  })
      //Whenever the player clicks attack, their character damages the defender. The opponent will lose HP (health points). These points are displayed at the bottom of the defender's picture.
      //each time the player attacks, their character's Attack Power increases by its base Attack Power.
          //For example, if the base Attack Power is 6, each attack will increase the Attack Power by 6 (12, 18, 24, 30 and so on).
          //The enemy character only has Counter Attack Power.
          //Unlike the player's Attack Points, Counter Attack Power never changes.

      //The opponent character will instantly counter the attack. When that happens, the player's character will lose some of their HP. These points are shown at the bottom of the player character's picture.


  //Your players should be able to win and lose the game no matter what character they choose. The challenge should come from picking the right enemies, not choosing the strongest player.

});
