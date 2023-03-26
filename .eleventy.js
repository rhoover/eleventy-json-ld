module.exports = (eleventyConfig) => {

  // While Eleventy does use the Luxon library for date manipulation, the point here is total control
  // and custimaztion
  eleventyConfig.addFilter("dateFormat", function(value) {

    // formatting the time for legibility, note this is 12hr time convention, i.e 1:56 PM
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
    let twelveHourTime = `${value.toLocaleString('en-US', {hour:'numeric', minute:'numeric', hour12:true})}`;

    //format the final date-time to be printed on the page
    let pubDate = `${value.getMonth()+1}/${value.getDate()}/${value.getFullYear()} - ${twelveHourTime}`;

    // send things off to be dealt with in your frontmatter thusly: "datePublished": "{{ page.date | dateFormat }}"
    return `${pubDate}`;
  });

  // here is the heart of the matter
  // grab your custimized frontmatter as a function parameter
  // from the "meta" object you've created in your template(s)
  eleventyConfig.addNunjucksShortcode("schemaDataShortCode", function(meta) {

    // the spread syntax for the win: https://gomakethings.com/the-spread-syntax-operator-in-vanilla-js/
    // to create a JS object you want
    let structuredData = {"@context": "https://schema.org", ...meta,};

    // send this off to be printed in your final HTML file
    // while simultainesly changing your JS object into valid JSON
    return `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`;
  });

  return {
    dir: {
      input: "src",
      output: "dist"
    }
  };
};