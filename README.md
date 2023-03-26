# Generate and Print Structured Data in Eleventy Without a Plugin

[Eleventy](https://www.11ty.dev/) workflow/technique to generate JSON-LD [structured data](https://schema.org/) all by yourself, without any plugins or third-party libraries.

- [Installation](#installation)
- [Usage](#usage)
- [Gravy](#gravy)
- [Validation](#validation)
- [Thanks](#thanks-to)
- [License](#license)


## Installation

There is nothing to install, you're doing this all by yourself. With [Eleventy's](https://www.11ty.dev/) help of course.

## Usage

### Create The Schema Data

This will be done in the [frontmatter](https://www.11ty.dev/docs/data-frontmatter/) of both your root index file as well as any [template](https://www.11ty.dev/docs/templates/).

This way is fine:

```yaml
meta:
  "@type": "Website"
  "name": "Vermont's Finest Site Imaginable"
  "publisher":
    "@type": "Organization"
    "name": "My Killer Agency"
    "contactPoint":
      "@type": "ContactPoint"
      "name": "Geezum Crowe"
```

This way is, to be honest, better, as it allows you to tap into Eleventy's processing magic (I'll explain):

```yaml
eleventyComputed:
  meta:
    "@type": "Website"
    "name": "Vermont's Finest Site Imaginable"
    "publisher":
      "@type": "Organization"
      "name": "My Killer Agency"
      "contactPoint":
        "@type": "ContactPoint"
        "name": "Geezum Crowe"
```

The next point of work is inside your .eleventy.js file. It's a grueling four(4) lines of code to add inside the module.exports of the configuration file. For reference, check out [Eleventy Short Codes](https://www.11ty.dev/docs/shortcodes/).

```js
  eleventyConfig.addNunjucksShortcode("schemaDataShortCode", function(meta) {
    let structuredData = {"@context": "https://schema.org", ...meta,};
    return `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`;
  });
```

The next point of work is inside your templates, specifically where to place the above shortcode. Typically, this is done in the ``` <head> ``` element, as you'll see in ```src/_includes/components/head-element.njk``` above, but the ``` <footer> ``` element is no less legitimate.

So here you go, your shortcode being used:

```njk
{% schemaDataShortCode meta %}
```

## Gravy

A couple of bonus snippets to help you understand how powerful Eleventy's global data and computional magic are.


### Date Filter

Recall, I mentioned that using [eleventyComputed](https://www.11ty.dev/docs/data-computed/) is preferred for your frontmatter schema-data creation. This magic lets you use variables and functions in your front matter without resorting to custom frontmatter formats.

For instance, if your Eleventy site is a blog, or blog-like with many many pages, including both the published date and modified date within the structured data for a particular page would be helpful.

Let's start with the published date data.

First, you will need the following [Eleventy Filter](https://www.11ty.dev/docs/filters/) within your .eleventy.js file:

```js
eleventyConfig.addFilter("dateFormat", function(value) {
  let twelveHourTime = `${value.toLocaleString('en-US', {hour:'numeric', minute:'numeric', hour12:true})}`;
  let pubDate = `${value.getMonth()+1}/${value.getDate()}/${value.getFullYear()} - ${twelveHourTime}`;
  return `${pubDate}`;
});
```

This will be used in your frontmatter thusly, note the ```"datePublished": "{{ page.date | dateFormat }}"```:

```yaml
eleventyComputed:
  meta:
    "@type": "Website"
    "name": "Vermont's Finest Site Imaginable"
    "datePublished": "{{ page.date | dateFormat }}"
    "publisher":
      "@type": "Organization"
      "name": "My Killer Agency"
      "contactPoint":
        "@type": "ContactPoint"
        "name": "Geezum Crowe"
```

And presto! Prefectly formatted date strings in your structured JSON.

## Gravy

### Global Data

So, one last treat, how about a "last modified" date in your structured data? Which I'm taking the liberty of referencing as the last "build" date for that file.

As you'll see in the code above, there's a ```built.js``` file in the ```src/_data directory```. In this frontmatter, "built" is the name of the file, and "builtAt" is what said file exports.

```yaml
eleventyComputed:
  meta:
    "@type": "Website"
    "name": "Vermont's Finest Site Imaginable"
    "datePublished": "{{ page.date | dateFormat }}"
    "dateModified": "{{ built.builtAt }}"
    "publisher":
      "@type": "Organization"
      "name": "My Killer Agency"
      "contactPoint":
        "@type": "ContactPoint"
        "name": "Geezum Crowe"
```

## Validation

You can test your structured data as valid JSON using one or all of the following tools:

- [Google's Structured Data Testing Tool](https://search.google.com/structured-data/testing-tool/u/0/)
- [JSON-LD Playground](https://json-ld.org/playground/)
- [JSON Schema Validator](https://www.jsonschemavalidator.net/)

## Thanks

Inspired by [PauTym](https://github.com/PauTym/simply-schema-eleventy) who created a super simple and effective generator of JSON-LD for your site. Sadly, the plugin fell into disregard, and had great difficulty working in Eleventy 2.0. So I re-purposed the work as configuration code, no plugin needed, and customizable by you for you.

## License

GNU GPL. See [LICENSE](./LICENSE).