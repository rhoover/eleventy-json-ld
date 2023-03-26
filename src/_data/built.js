
// since newly modified or updated, the build into production/distribution is today
let built = new Date();

// formatting the time today for legibility, note this is 12hr time convention, i.e 1:56 PM
let twelveHours = `${built.toLocaleString('en-US', {hour:'numeric', minute:'numeric', hour12:true})}`;

//format the final date-time to be printed on the page
let pubDate = `${built.getMonth()+1}/${built.getDate()}/${built.getFullYear()} - ${twelveHours}`;

module.exports = {

  // send the above off to be dealth with in your frontmatter thusly: "dateModified": "{{ built.builtAt }}"
  builtAt: pubDate
};