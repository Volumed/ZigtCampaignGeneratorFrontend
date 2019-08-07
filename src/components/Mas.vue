<template>
    <v-container grid-list-md>
        <v-layout wrap>
            <v-flex md9>    
                <v-card min-width="100%" min-height="100%" :loading="loading" loader-height="8px">
                    <v-card-title class="display-1 accent--text text-uppercase font-weight-bold">{{creatorName}} Campaign Name Generator</v-card-title>
                    <v-card-text>
                        <v-form ref="form" v-model="valid" lazy-validation>
                            <v-autocomplete prepend-icon="mdi-domain" class="mt-4 mb-2" color="secondary" item-color="secondary" label="Advertiser name" v-model="advertiser" :items="advertisers" :rules="advertiserRules" required></v-autocomplete>
                            <v-dialog ref="dialog" v-model="modal" :return-value.sync="date" persistent full-width width="290px">
                                <template v-slot:activator="{ on }">
                                    <v-text-field color="secondary" class="mb-2" v-model="dateFormatted" value="dateFormatted" label="Please select the start date of your campaign" prepend-icon="mdi-calendar-month" readonly :rules="dateRules" v-on="on"></v-text-field>
                                </template>
                                <v-date-picker header-color="secondary" color="accent" v-model="date" type="month" scrollable>
                                    <v-spacer></v-spacer>
                                    <v-btn text color="primary" @click="modal = false">Cancel</v-btn>
                                    <v-btn text color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
                                </v-date-picker>
                            </v-dialog>
                            <v-text-field color="secondary" class="mb-4" v-model="name" prepend-icon="mdi-pin-outline" :counter="25" :rules="nameRules" label="Enter your unique campaign part" required></v-text-field>
                            <v-card id="campaignName" v-bind:class="classObject" class="mb-4">
                                <v-card-title class="text-uppercase white--text"><v-icon color="white" class="mr-2">mdi-auto-fix</v-icon> Your unique campaign name:</v-card-title>
                                <v-card-text><v-text-field dark readonly class="headline font-weight-bold" id="uniqueCampaignName" :value="campaignName"></v-text-field></v-card-text>
                            </v-card>                    
                            <v-btn :disabled="!valid" :loading="loadingCopy" color="success" class="mr-4" @click="validate">
                                <v-icon left>mdi-attachment</v-icon> Copy to clipboard
                            </v-btn>
                            <v-btn color="error" class="mr-4" @click="reset">
                                <v-icon left>mdi-refresh</v-icon> Reset
                            </v-btn>
                        </v-form>   
                        <v-snackbar v-model="snackbar" color="success" :right=true :bottom=true :timeout="timeout">
                            {{ text }}
                        </v-snackbar>                
                    </v-card-text>      
                </v-card>
            </v-flex>
            <v-flex md3>
                <v-card min-width="100%" min-height="100%" :loading="loadingLast" loader-height="8px">
                    <v-card-title class="headline accent--text text-uppercase font-weight-bold">Just created...</v-card-title>
                    <v-card-text>
                        <span v-for="uniqueName in uniqueNames" v-bind:key="uniqueName">
                            <v-list-item dense>
                                <v-list-item-content>
                                    <v-list-item-title>{{uniqueName}}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>   
                        </span>             
                    </v-card-text>      
                </v-card>
            </v-flex>
        </v-layout>
        <v-card v-if="compliment" min-width="100%" color="info" min-height="100%" class="pb-2 mt-1 text-center">
            <v-card-title class="headline white--text text-uppercase font-weight-bold"><span style="width:100%;text-align:center;">{{compliment}}</span></v-card-title>
        </v-card>
        <v-dialog v-model="dialog" width="500">
            <v-card>
                <v-card-title class="headline primary white--text" primary-title><v-icon class="white--text" left>mdi-alert-circle-outline</v-icon> {{creatorName}} name already exists</v-card-title>
                <v-card-text class="mt-3">
                    {{campaignName}} already exists, you are hereby warned, but able to continue. 
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="dialog = false">
                        I understand
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>        
    </v-container>
</template>

<script>
import axios from 'axios'

export default {
    data: vm => ({
        loading: 'true secondary',
        creatorName: 'MAS',
        loadingCopy: false,
        loadingLast: 'true secondary',
        valid: true,
        advertiser: '',
        advertisers: ['Advertiser is not in the list'],
        advertiserRules: [
            v => !!v || 'Advertiser is required',
        ],    
        notListed: false,    
        date: new Date().toISOString().substr(0, 10),
        dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
        dateRules: [
            v => !!v || 'A date is required',
        ],
        modal: false,
        name: '',
        nameRules: [
            v => !!v || 'Unique part is required',
            v => (v && v.length <= 25) || 'Unique part must be less than 25 characters',
            v => /^[a-zA-Z-0-9]+$/.test(v) || 'Only letters (incl. capital letters), numbers and hyphen (-) are allowed.',
        ],
        campaignName: 'Your unique name will magically appear here! Start filling in the form.',
        snackbar: false,
        text: '',
        dialog: false,
        timeout: 2000, 
        uniqueNames: [],  
        compliment: '',
        compliments: ["You look great today.",
        "You’re a smart cookie.",
        "I bet you make babies smile.",
        "You have impeccable manners.",
        "I like your style.",
        "You have the best laugh.",
        "I appreciate you.",
        "You are the most perfect you there is.",
        "Our system of inside jokes is so advanced that only you and I get it. And I like that.",
        "You’re strong.",
        "Your perspective is refreshing.",
        "You’re an awesome friend.",
        "You light up the room.",
        "You deserve a hug right now.",
        "You should be proud of yourself.",
        "You’re more helpful than you realize.",
        "You have a great sense of humor.",
        "You’ve got all the right moves!",
        "Is that your picture next to “charming” in the dictionary?",
        "Your kindness is a balm to all who encounter it.",
        "You’re all that and a super-size bag of chips.",
        "On a scale from 1 to 10, you’re an 11.",
        "You are brave.",
        "You’re even more beautiful on the inside than you are on the outside.",
        "You have the courage of your convictions.",
        "Aside from food. You’re my favorite.",
        "If cartoon bluebirds were real, a bunch of them would be sitting on your shoulders singing right now.",
        "You are making a difference.",
        "You’re like sunshine on a rainy day.",
        "You bring out the best in other people.",
        "Your ability to recall random factoids at just the right time is impressive.",
        "You’re a great listener.",
        "How is it that you always look great, even in sweatpants?",
        "Everything would be better if more people were like you!",
        "I bet you sweat glitter.",
        "You were cool way before hipsters were cool.",
        "That color is perfect on you.",
        "Hanging out with you is always a blast.",
        "You always know — and say — exactly what I need to hear when I need to hear it.",
        "You smell really good.",
        "You may dance like no one’s watching, but everyone’s watching because you’re an amazing dancer!",
        "Being around you makes everything better!",
        "When you say, “I meant to do that,” I totally believe you.",
        "When you’re not afraid to be yourself is when you’re most incredible.",
        "Colors seem brighter when you’re around.",
        "You’re more fun than a ball pit filled with candy. (And seriously, what could be more fun than that?)",
        "That thing you don’t like about yourself is what makes you so interesting.",
        "You’re wonderful.",
        "Everyday is just BLAH when I don’t see you For reals!",
        "Jokes are funnier when you tell them.",
        "You’re better than a triple-scoop ice cream cone. With sprinkles.",
        "Your bellybutton is kind of adorable.",
        "Your hair looks stunning.",
        "You’re one of a kind!",
        "You’re inspiring.",
        "If you were a box of crayons, you’d be the giant name-brand one with the built-in sharpener.",
        "You should be thanked more often. So thank you!!",
        "Our community is better because you’re in it.",
        "Someone is getting through something hard right now because you’ve got their back.",
        "You have the best ideas.",
        "You always know how to find that silver lining.",
        "Everyone gets knocked down sometimes, but you always get back up and keep going.",
        "You’re a candle in the darkness.",
        "You’re a great example to others.",
        "Being around you is like being on a happy little vacation.",
        "You always know just what to say.",
        "You’re always learning new things and trying to better yourself, which is awesome.",
        "If someone based an Internet meme on you, it would have impeccable grammar.",
        "You could survive a Zombie apocalypse.",
        "You’re more fun than bubble wrap.",
        "When you make a mistake, you fix it.",
        "Who raised you? They deserve a medal for a job well done.",
        "You’re great at figuring stuff out.",
        "Your voice is magnificent.",
        "The people you love are lucky to have you in their lives.",
        "You’re like a breath of fresh air.",
        "You’re gorgeous — and that’s the least interesting thing about you, too.",
        "You’re so thoughtful.",
        "Your creative potential seems limitless.",
        "You’re the coolest person I know. And I consider myself bet friends with like all celebrities, so. . . .",
        "You’re irresistible when you blush.",
        "Actions speak louder than words, and yours tell an incredible story.",
        "Somehow you make time stop and fly at the same time.",
        "When you make up your mind about something, nothing stands in your way.",
        "You seem to really know who you are.",
        "Any team would be lucky to have you on it.",
        "In high school I bet you were voted “most likely to keep being awesome.”",
        "I bet you do the crossword puzzle in ink.",
        "Babies and small animals probably love you.",
        "If you were a scented candle they’d call it Perfectly Imperfect (and it would smell like summer).",
        "There’s ordinary, and then there’s you.",
        "You’re someone’s reason to smile.",
        "You’re even better than a unicorn, because you’re real.",
        "How do you keep being so funny and making everyone laugh?",
        "You have a good head on your shoulders.",
        "Has anyone ever told you that you have great posture?",
        "The way you treasure your loved ones is incredible.",
        "You’re really something special.",
        "You’re a gift to those around you."]
    }),
    created: function () {
        this.apiAdvertisers()
        this.apiLast()
    },
    computed: {
      computedDateFormatted () {
        return this.formatDate(this.date)
      },
      classObject: function () {
            return {
                success: this.advertiser && this.dateFormatted && this.name && this.valid && !this.notListed,
                error: !this.valid,
                orange: this.notListed
            }
        }
    },
    watch: {
      date () {
        this.dateFormatted = this.formatDate(this.date)
        this.generator()
      },
      advertiser () {
        this.generator()
      },
      name () {
        this.generator()
      },
      dateDisabled () {
          this.generator()
      }
    },
    methods: {
        apiAdvertisers () {
            axios.get(process.env.VUE_APP_SECRET + '/advertisers')
            .then((response) => {
                for (var i = 0; i < response.data.length; i++) {
                    this.advertisers.push(response.data[i].advertiser)
                }
                this.loading = false;
            })
            .catch((error) => {
                console.log(error);
            });
        },
        apiLast () {
             axios.get(process.env.VUE_APP_SECRET + '/mas')
            .then((response) => {
                for (var i = 0; i < response.data.length; i++) {
                    this.uniqueNames.push(response.data[i].unique)
                }
                this.loadingLast = false;
            })
            .catch((error) => {
                console.log(error);
            });           
        },
        generator () {
            if (this.advertiser == 'Advertiser is not in the list') {
               this.campaignName = 'Please inform team dashboard, they will fix your problem immediately!' 
               this.notListed = true
            } else {
                this.notListed = false
                if (this.advertiser) {
                    this.campaignName = this.advertiser
                    if (this.dateFormatted) {
                        this.campaignName += '_'
                        this.campaignName += this.dateFormatted
                        if (this.name) {
                            this.campaignName += '_'
                            this.campaignName += this.name
                        }
                    }
                }
            }
        },
        validate () {
            if (this.$refs.form.validate()) {
                this.loadingCopy = true
                axios.post(process.env.VUE_APP_SECRET + '/mas/create',
                {
                    unique: this.campaignName,
                })
                .then((response) => {
                    this.snackbar = true
                    this.loadingCopy = false
                    this.compliment = this.compliments[Math.floor(Math.random() * this.compliments.length)];
                    this.uniqueNames.unshift(this.campaignName)
                    if(this.uniqueNames.length > 11) {
                        this.uniqueNames.pop();
                    }
                })
                .catch((error) => {
                    this.dialog = true
                    this.snackbar = true
                    this.loadingCopy = false
                });
                this.copyCampaignCode()
            }
        },
        reset () {
            this.$refs.form.reset()
            this.date = ''
            this.name = ''
            this.advertiser = ''
            this.dateFormatted = ''
            this.compliment = ''
        },
        formatDate (date) {
            if (!date) return null

            const [year, month] = date.split('-')
            return `${year}_${month}`
        },
        parseDate (date) {
            if (!date) return null

            const [month, year] = date.split('/')
            return `${year}-${month.padStart(2, '0')}`
        },
        copyCampaignCode () {
          const testingCodeToCopy = document.querySelector('#uniqueCampaignName')
          testingCodeToCopy.setAttribute('type', 'text')
          testingCodeToCopy.select()

          try {
            let successful = document.execCommand('copy')
            let msg = successful ? 'successful' : 'unsuccessful'
            this.text = 'Unique campaign name was copied ' + msg
          } catch (err) {
            this.text = 'Oops, unable to copy'
          }
        },        
    },
};
</script>

<style lang="scss">
    #campaignName {
        background-color: #9accdc;
    }
</style>