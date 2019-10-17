const request = require("request");
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const db = require("../models");

module.exports = function(app) {
  app.get("/articles", function(req, res) {
    request(
      "https://www.nytimes.com/topic/subject/gardens-and-gardening",
      function(error, response, html) {
        const $ = cheerio.load(html);

        const results = [];

        $("a.story-link").each(function(i, element) {
          const link = $(element).attr("href");
          const title = $($(element).find("h2.headline")[0])
            .text()
            .trim();
          const summary = $($(element).find("p.summary")[0])
            .text()
            .trim();
          results.push({
            link: link,
            title: title,
            summary: summary
          });
        });

        db.Article.create(results)
          .then(function(dbArticle) {})
          .catch(function(err) {
            return res.json(err);
          });

        db.Article.find({}).then(function(dbData) {
          console.log("DB DATA --------------------, ", dbData);
          res.json(dbData);
        });
      }
    );
  });
};
