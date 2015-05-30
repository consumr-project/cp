'use strict';

var http = require('http');

var base_url = 'http://boilerpipe-web.appspot.com/extract?' +
    'extractor=ArticleExtractor&' +
    'output=json&' + 
    'extractImages=3&' +
    'url=';

/**
 * @param {String} url
 * @param {Function} callback
 */
module.exports = function (url, callback) {
    // XXX - remove once done testing
    return callback({
        "response":{
           "title":"China’s High Hopes for Growing Those Rubber Tree Plants - NYTimes.com",
           "content":"China’s High Hopes for Growing Those Rubber Tree Plants\nBy BECKY DAVIS\nSupported By\nPhoto\nVillagers collected the timber of unproductive rubber trees near Tuanjie, in southern China. A program aims to make the industry more sustainable. Credit Adam Dean for The New York Times\nAdvertisement\nContinue reading the main story\nJINGHONG, China —  In the farming village of Tuanjie, in the hills above Jinghong, in southwest Yunnan Province, nearly every family lives in a two- or three-story concrete house, testament to a prosperity built during the boom years for natural rubber production.\nSitting in a gleaming new kitchen larger than the thatched hut that once stood on the same spot, Wang Guiying, 51, recalled hunting wild animals to survive and growing cotton to make her own clothes in the days before her family in 1983 became the first in the village to plant rubber trees. “Our lives then just got better and better,” she said.\nBy 2011, the Wangs were earning nearly $13,000 a year from their four-acre farm, while neighbors with larger plots earned close to six-figure incomes. Family members built their two-story home, bought a car and a flat screen television and went on group tours to distant Beijing and nearby Vietnam.\nThis year, because of the drop in oil prices, which set the price for natural as well as synthetic rubber, they predict they will make only about $1,600.\nPhoto\nA villager harvested rubber from her rubber tree plantation at dawn in Tuanjie Village. Credit Adam Dean for The New York Times\n“We don’t know why the price went down, but we have nothing else to depend on,” said Ms. Wang’s son-in-law, Jie Er, 32.\nRecognizing that, environmental officials just outside Jinghong, the region’s major city, have been testing a plantation model that they hope will become the blueprint for a more sustainable and economically stable rubber industry.\nOn approximately 165 acres of land, workers have interspersed the rubber trees with cacao, coffee and macadamia trees, as well as high-value timber species. The mix, promoted as “environmentally friendly rubber,” is intended to decrease soil erosion, improve water quality and increase biodiversity, among other benefits.\nRubber plantations first appeared in this tropical region in the mid-1950s as state farms run by the centrally planned economy. Mile after mile, the uniform rows of rubber trees fan out across the valleys where Asian elephants and white-cheeked gibbons once roamed. From afar, they meld into an unnaturally even carpet of single-shade green, a stark contrast to patches of remaining natural forest.\nThe transition to a free-market economy combined with rising rubber prices led to the rapid expansion of plantations beginning in the late 1990s. These days, over a fifth of all land in the Xishuangbanna prefecture of Yunnan Province is devoted to rubber production, an area of cultivation that tripled in size between 2002 and 2010. Natural forest coverage, in turn, has fallen to less than 50 percent in 2003 from nearly 70 percent in the late 1970s, snuffing out wildlife in a corner of China renowned as one of its most biologically diverse.\nLi Qingyou, director of the Bio-Industrial Crops Office, the governmental body that is seeking to convert nearly a fourth of the region’s rubber-growing areas to this new more eco-friendly model by 2020, stood next to his Jeep facing a view of new high-rises and the Mekong River beyond, feet planted on the slope separating a row of coffee trees from rubber trees.\nAdvertisement\nContinue reading the main story\n“We used to be so focused on developing the economy that we planted rubber and ignored the environmental impact,” he said, “but now we realize that this isn’t good for us, and it isn’t good for the economy either.”\nLast year, the prefecture-level government spent $1.6 million to convert nearly 21,500 acres of existing rubber plantations into environmentally balanced ones. According to officials, an additional 16,000 or so acres are in the pipeline for this year. With rubber prices at a 10-year low and farmers panicked over sinking incomes, officials say they have a rare opportunity to promote their ideas, which include introducing new products that make farmers less dependent on a single revenue stream.\n“When rubber prices were very high, it simply wasn’t easy to get anything done,” said Pan Yuwen, 48, a technical adviser in a government department specially created to assist farmers with following the new practices.\nThere is no official consensus as to what exactly “environmentally friendly rubber” ought to be; researchers are divided as to what intercropping species and planting practices would best balance economic needs against purely environmental concerns.\nThe current program includes measures like the distribution of free seedlings — some 500,000 in 2014 — and the discouragement of planting rubber trees on steep slopes or in areas over 2,600 feet in elevation, where soil erosion and other environmental damage are much worse and yields proportionately lower.\nThough rubber farmers typically engage in intercropping while the trees are still young and have not yet developed full canopies, it is uncommon for farmers to integrate other species into mature plantations. Yet, tea, cacao, coffee and a number of Chinese medicinal plants can grow even in the midst of a rubber forest, as can valuable, slow-growing trees like teak.\nMr. Jie said he was intrigued by the seedling distribution program, though he would never cut down his rubber trees, which take seven years to mature. “We’re wondering if we should also start planting macadamia nuts or Aquilaria trees,” tall evergreens that produce resinous agarwood, which is used in perfumes and is one of the world’s most expensive raw materials.\nMany others in Tuanjie spoke of plans to leave and take jobs as day laborers in Jinghong to make ends meet.\nCritics of the government’s rubber program say it lacks clear environmental standards as well as incentives that could get local farmers to participate. And the vast majority of rubber plantations now belong to individual small holders like the Wang family who own long-term rights to use of the land and make their own economic decisions.\n“The government has no power to effectively push this program out, because at a policy level they have no way to stop villagers with no idea of what it means to be environmentally friendly from doing whatever they want,” said Chen Jin, director of the Xishuangbanna Tropical Botanical Garden Research Center, which helped develop the Jinghong model site. The process of educating villagers would be slow, he added, “like brewing tea with cold water.”\nHe dismissed the government’s progress indicators and targets as inflated to the point of being “simply impossible.”\nMr. Li of the Bio-Industrial Crops Office acknowledged that the targets were somewhat fanciful but said they were devised to show just how serious the government is about changing the status quo. “Otherwise, people will lack enthusiasm,” he said.\nA version of this article appears in print on May 28, 2015, on page A11 of the New York edition with the headline: China’s High Hopes for Growing Those Rubber Tree Plants . Order Reprints | Today's Paper | Subscribe\nLoading...",
           "source":"http://www.nytimes.com/2015/05/28/world/asia/chinas-high-hopes-for-growing-those-rubber-tree-plants.html?_r=0",
           "images":[
              {
                 "src":"http://static01.nyt.com/images/2015/05/28/world/28jinghong-web/28jinghong-web-master675.jpg",
                 "width":null,
                 "height":null,
                 "alt":null
              }
           ]
        },
        "status":"success"
    });

    http.get(base_url + encodeURIComponent(url), function (res) {
        var chunks = [];

        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            chunks.push(chunk);
        });

        res.on('end', function (chunk) {
            callback(JSON.parse(chunks.join("")));
        });
    }).end();
};
