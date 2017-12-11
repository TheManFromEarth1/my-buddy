//File containing the Character object

function Character(obj) {
  //Place character in the middle of the screen
  this.xPos = 375;
  this.yPos = 375;

  //The array of images that represent the current character
  this.imgArr = [];
  //The stage is similar to the age, but is changed at specific ages.  0 is the baby stage

  //booleans that affect the display function
  this.isPooping = false;
  this.isBeingMedicated = false;

  //Used for the walk method
  this.walkCycle = walkImg;
  this.frontImage = petImg;
  this.walkDir = 1;
  this.walkUp = true;
  this.walkCycleCounter = 0;
  this.walkTimer = 8;

  //Used for most animations
  this.frameTimer = 20;
  this.frameState = 0;

  //Character's stats cannot excede these numbers
  this.maxHealth = 100;
  this.maxHunger = 50;
  this.maxLove = 50;

  //Used for display function
  this.loveAni = false;
  this.noAni = false;
  this.wait = false;

  //Displays the character on the screen depending on what it's doing.
  //Certain states/animations take precedent over others.
  this.display = function() {
    //If it's dead...
    if (!this.properties.condition.alive) {
      if (!bgDeadSongBegin.isPlaying() && !bgDeadSong.isPlaying()) {
        bgDeadSong.loop();
      }
      charDeadImg.draw(375, this.yPos, (imgNum) => {
        if (imgNum === charDeadImg.images.length - 1) {
          ghosties.draw(375, this.yPos - 100);
        }
      });

    }
    //Unfinished function if the character is asleep...
    else if (this.properties.condition.asleep) {
      //TO BE IMPLEMENTED
    }
    //If the animation of curing the pet is going on...
    else if (this.isBeingMedicated) {
      image(charPoopImg, 375, this.yPos);
      syringes.draw(420, 330, (num) => {
        if (num === syringes.images.length - 1) {
          console.log('yay');
          this.isBeingMedicated = false;
          syringes.reset();
        }
      });
    }
    //If it's performing the love animation...
    else if (this.loveAni) {
      if (this.frameState === 0) {
        image(loveAni[0], this.xPos, this.yPos);
        if (this.frameTimer % 15 === 0) {
          this.frameState = 1;
        }
      } else {
        image(loveAni[1], this.xPos, this.yPos - 5);
        if (this.frameTimer % 15 === 0) {
          this.frameState = 0;
        }
      }
      this.frameTimer--;
      if (this.frameTimer === 0) {
        this.loveAni = false;
      }
    }
    //If it's shaking it's head...
    else if (this.noAni) {
      if (this.frameState === 0) {
        image(madImg[0], 375, this.yPos);
        this.frameTimer--;
        if (this.frameTimer % 15 === 0) {
          this.frameState = 1;
        }
      } else {
        image(madImg[1], 375, this.yPos);
        this.frameTimer--;
        if (this.frameTimer % 15 === 0) {
          this.frameState = 0;
        }
      }
      if (this.frameTimer === 0) {
        this.noAni = false;
      }
    }
    //If it's pooping...
    else if (this.isPooping) {
      if (this.frameState === 0) {
        image(charPoopImg, this.xPos - 3, this.yPos);
        this.frameTimer--;
        if (this.frameTimer % 15 === 0) {
          this.frameState = 1;
        }
      } else {
        image(charPoopImg, this.xPos + 3, this.yPos);
        this.frameTimer--;
        if (this.frameTimer % 15 === 0) {
          this.frameState = 0;
        }
      }
      if (this.frameTimer === 0) {
        this.isPooping = false;
        poopSound.play();
        poopOnScreen.push(new Poop(this.xPos, this.yPos, random(60) + 50));
      }
    }
    //If it's sick...
    else if (this.properties.condition.sick) {
      if (this.frameState === 0) {
        image(sickImg[0], 375, this.yPos);
        this.frameTimer--;
        if (this.frameTimer === 0) {
          this.frameState = 1;
          this.frameTimer = 20;
        }
      } else {
        image(sickImg[1], 375, this.yPos);
        this.frameTimer--;
        if (this.frameTimer === 0) {
          this.frameState = 0;
          this.frameTimer = 20;
        }
      }
    }
    //If mad (unimplemented)
    else if (this.properties.condition.mad) {

    }
    //If no special conditions...walk around screen
    else {
      if (this.wait) {
        image(this.frontImage, this.xPos, this.yPos);
        this.walkTimer--;
        if (this.walkTimer == 0) {
          this.wait = false;
          this.walkTimer = 8;
        }
      } else if (this.walkDir == 1) {
        this.walkLeft();
        this.xPos--;
        if (this.xPos <= 100) {
          this.walkDir = 0;
          this.wait = true;
          this.walkTimer = 10;
        }
      } else if (this.walkDir == 0) {
        this.walkRight();
        this.xPos++
          if (this.xPos >= 650) {
            this.walkDir = 1;
            this.wait = true;
            this.walkTimer = 10;
          }
      }
    }
  };
  //Set how often these functions will be called and store the interval Ids
  this.setIntervals = function() {
    const a = setInterval(() => {
      this.updateAge()
    }, 60000);
    const b = setInterval(() => {
      this.makeHungry()
    }, 300000);
    const c = setInterval(() => {
      this.giveHate()
    }, 300000);
    const d = setInterval(() => {
      this.decrementHealth()
    }, 300000);
    const e = setInterval(() => {
      this.poop()
    }, 360000);
    //SET ALL INTERVALS FOR ALL OF THE HUNGER, HAPPINESS, ETC FUNCTIONS
    var intids = {
      //Update age every minute
      ageInt: a,
      //Update hunger every 5 minutes
      hungerInt: b,
      //Check if love should be decremented every 5 minutes
      loveInt: c,
      //Check if health should be decremented every 5 minutes
      healthInt: d,
      //Poop every so-often
      poopInt: e,
    };
    return intids;
  };
  //Sets the character up to poop
  this.poop = function() {
    if (!this.properties.condition.sick && this.properties.condition.alive) {
      this.isPooping = true;
      this.frameTimer = 130;
    }
  };
  //Ages up the character by one minute
  this.updateAge = function(val) {
    //val is part of our offline mode workaround
    const incr = val || 1;

    this.properties.age.minutes += incr;
    while (this.properties.age.minutes >= 60) {
      this.properties.age.minutes -= 60;
      this.properties.age.hours += 1;
    }

    while (this.properties.age.hours >= 24) {
      this.properties.age.hours -= 24;
      this.properties.age.days += 1;
    }

    // Auto-save character only during interval
    if (val === undefined) {
      saveGame();
    }
  };
  this.decrementHealth = function(val) {
    //Subtract from health
    //If health < 15, pet is ill
    //If health is 0, pet is dead
    if(val) {
      this.properties.health -= val;
    }

    if (this.properties.hunger < 10 || this.properties.love < 10 || poopOnScreen.length > 3) {
      this.properties.health -= 1;
    }

    if (this.properties.health <= 0) {
      this.die();
    } else if (this.properties.health < 15) {
      this.properties.condition.sick = true;
    }

  };
  this.changeStage = function() {
    //Using the health as one variable, and another later implemented
    //"good care" variable, change the stage to the appropriate character
  };
  //Determine if the character will respond to the love button
  this.loveButton = function() {
    if (canLove === true) {
      this.giveLove();
      canLove = false;
      this.loveAnimation();
    } else {
      this.angerAnimation();
    }
  };
  //Sets the character up to perform the "love" animation
  this.loveAnimation = function() {
    loveSound.play();
    this.frameTimer = 100;
    this.loveAni = true;
  };
  this.giveLove = function() {
    //Add to the pet's love variable
    if (this.properties.love <= this.maxLove) {
      this.properties.love += 10;
    }
    //reset the interval for love being subtracted from
    clearInterval(this.intervalIds.loveInt);
    this.intervalIds.loveInt = setInterval(() => {
      this.giveHate()
    }, 600000);
  };
  //Decrement the love variable
  this.giveHate = function(val) {
    const mult = val || 1;
    this.properties.love -= 2 * mult;
    if (this.properties.love < 0) {
      this.properties.love = 0;
    }
  };
  //Begins the character's journey into death
  this.die = function() {
    this.properties.condition.alive = false;
    bgSong.stop();
    bgDeadSongBegin.play();
    this.frameTimer = 300;

  };
  //If character is dead, call this function to reset everything in the properties object of the character
  this.reset = function() {
    this.properties = {
      name: "",
      health: 50,
      hunger: 0,
      dirty: 0,
      love: 0,
      stage: 0,
      condition: {
        asleep: false,
        sick: false,
        mad: false,
        alive: true
      },
      age: {
        hours: 0,
        minutes: 0,
        days: 0
      },
      date: Date.now()
    };
    //go back to playing the normal bg song
    if (bgDeadSong.isPlaying() || bgDeadSongBegin.isPlaying()) {
      bgDeadSong.stop();
      bgDeadSongBegin.stop();
      bgSong.loop();
    }

    charDeadImg.reset();
  }
  //Takes in a string, food, and determines what feed will do
  this.feed = function(food) {
    //Increment the hunger variable
    //Possibly give love if the food is good
    //Possibly take love if the food is disliked by this character
    if (this.properties.hunger < this.maxHunger) {
      if (food === "Apple") {
        this.properties.hunger += 10;
        this.properties.health += 5;
        return true;
      } else if (food === "Cookie") {
        this.hunger += 10;
        this.health -= 5;
        this.giveLove();
        return true;
      }
    }
    //If the character is full, return false which signals the "no" animation
    else {
      return false;
    }
  };
  //Decrements from the hunger variable
  this.makeHungry = function(val) {
    if(val) {
      this.properties.hunger -= val;
      if(this.properties.hunger < 0) {
        this.properties.hunger = 0;
      }
    } else {
      this.properties.hunger -= 5
      if (this.properties.hunger < 0) {
        for (let i = this.properties.hunger; i < 0; i++) {
          this.properties.hunger++;
          this.decrementHealth();
        }

      }
    }
  };
  //Sets the character up to perform the sick animation
  this.makeSick = function() {
    this.frameTimer = 20;
    this.properties.condition.sick = true;
  }
  //If the character is attempting to be cured, determine whether or not
  //it is cured, as well as determining which animation should play
  this.cure = function() {
    if (this.properties.condition.sick === true) {
      this.medAnimation();
      healSound.play();
      let f = function() {
        let i = random(2);
        if (i >= 1) {
          return false;
        } else {
          return true;
        }
      }
      if (f()) {
        this.properties.condition.sick = false;
        this.properties.health += 15;
      }
    }
    //If it isn't sick, shake it's head
    else {
      this.angerAnimation();
    }
  }
  //Starts the shaking head animation
  this.angerAnimation = function() {
    this.frameTimer = 100;
    this.noAni = true;
    noSound.play();
  }
  //Animation of a syringe going into the character
  this.medAnimation = function() {
    this.isBeingMedicated = true;
    this.frameTimer = 120;
  }
  //Has the character walk to the left of the screen
  this.walkLeft = function() {
    //walks left on the screen
    if (this.walkUp) {
      if (this.walkTimer > 0) {
        image(this.walkCycle[this.walkCycleCounter], this.xPos, this.yPos);
        this.walkTimer--;
      } else {
        image(this.walkCycle[this.walkCycleCounter], this.xPos, this.yPos);
        this.walkCycleCounter++;
        this.walkTimer = 8;
        if (this.walkCycleCounter == 4) {
          this.walkUp = false;
        }
      }
    } else {
      if (this.walkTimer > 0) {
        image(this.walkCycle[this.walkCycleCounter], this.xPos, this.yPos);
        this.walkTimer--;
      } else {
        image(this.walkCycle[this.walkCycleCounter], this.xPos, this.yPos);
        this.walkCycleCounter--;
        this.walkTimer = 8;
        if (this.walkCycleCounter == 0) {
          this.walkUp = true;
        }
      }
    }
  }
  //Character walking left animation
  this.walkRight = function() {
    if (this.walkUp) {
      if (this.walkTimer > 0) {
        scale(-1, 1);
        image(this.walkCycle[this.walkCycleCounter], -1 * this.xPos, this.yPos);
        this.walkTimer--;
      } else {
        scale(-1, 1);
        image(this.walkCycle[this.walkCycleCounter], -1 * this.xPos, this.yPos);
        this.walkCycleCounter++;
        this.walkTimer = 8;
        if (this.walkCycleCounter == 4) {
          this.walkUp = false;
        }
      }
    } else {
      if (this.walkTimer > 0) {
        scale(-1, 1);
        image(this.walkCycle[this.walkCycleCounter], -1 * this.xPos, this.yPos);
        this.walkTimer--;
      } else {
        scale(-1, 1);
        image(this.walkCycle[this.walkCycleCounter], -1 * this.xPos, this.yPos);
        this.walkCycleCounter--;
        this.walkTimer = 8;
        if (this.walkCycleCounter == 0) {
          this.walkUp = true;
        }
      }
    }
  }

 /*this.setUnlockable(unlockable) = function() {
    this.properties.unlockables.unlockable = true;
    saveGame();
  }*/

  //save the intervals from setIntervals into this variable
  this.intervalIds = this.setIntervals();

  //If the user logs in and has no entry in the database
  if (obj === undefined) {
    // Properties contains everything that should be stored in database
    this.properties = {
      name: "",
      health: 50,
      hunger: 0,
      dirty: 0,
      love: 0,
      stage: 0,
      condition: {
        asleep: false,
        sick: false,
        mad: false,
        alive: true
      },
      age: {
        hours: 0,
        minutes: 0,
        days: 0
      },
      unlockables: {},
      date: Date.now()
    };
  }
  //If there exists an entry in the database for the current user, set properties to what already
  //exists in memory, and decrement variables according to how long the user has been logged out.
  else {
    this.properties = obj;

    // Number of minutes passed
    const diff = Math.floor((Date.now() - this.properties.date) / 1000 / 60);
    const diff5 = Math.floor(diff / 5);

    // Handle passage of time since last login
    this.decrementHealth(diff5);
    this.giveHate(diff5);
    this.makeHungry(diff5);
    this.updateAge(diff);

  }
}
