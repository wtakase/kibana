# Kibana 4.5.4-snapshot

[![Build Status](https://travis-ci.org/elastic/kibana.svg?branch=master)](https://travis-ci.org/elastic/kibana?branch=master)

Kibana is an open source ([Apache Licensed](https://github.com/elastic/kibana/blob/master/LICENSE.md)), browser based analytics and search dashboard for Elasticsearch. Kibana is a snap to setup and start using. Kibana strives to be easy to get started with, while also being flexible and powerful, just like Elasticsearch.

## Requirements

- Elasticsearch version 2.3.0 or later
- This Kibana
- [kibaha.index selection](https://github.com/wtakase/kibana-index-selection)
- Reverse proxy server like Apache HTTPD which authenticates a user and sends the username via request header
- LDAP server for kibana.index selection plugin


## Installation

* Clone: [https://github.com/wtakase/kibana](https://github.com/wtakase/kibana)
* Check out to `4.5-multi-kibana-indices-with-plugin`
* Build the kibana by reference to [https://github.com/elastic/kibana/blob/4.5/CONTRIBUTING.md](https://github.com/elastic/kibana/blob/4.5/CONTRIBUTING.md).
* Run the built kibana
* Visit [http://localhost:5601](http://localhost:5601)


## Configuration for multiple kibana.index handling

* Edit `config/kibana.yml`

```bash
elasticsearch.handleMultiIndices: true
elasticsearch.proxyUserHeader: "x-proxy-user"
kibana_index_selection.session.secretkey: the-password-must-be-at-least-32-characters-long
kibana_index_selection.session.timeout: 3600000
kibana_index_selection.ldap.url: ldap://ldap.example.com:389
kibana_index_selection.ldap.userbase: ou=People,dc=example,dc=com
kibana_index_selection.ldap.rolebase: ou=Groups,dc=example,dc=com
kibana_index_selection.ldap.rolename_attribute: cn
```

## Upgrade from previous version

* Move any custom configurations in your old kibana.yml to your new one
* Reinstall plugins
* Start or restart Kibana

## Quick Start

You're up and running! Fantastic! Kibana is now running on port 5601, so point your browser at http://YOURDOMAIN.com:5601.

The first screen you arrive at will ask you to configure an **index pattern**. An index pattern describes to Kibana how to access your data. We make the guess that you're working with log data, and we hope (because it's awesome) that you're working with Logstash. By default, we fill in `logstash-*` as your index pattern, thus the only thing you need to do is select which field contains the timestamp you'd like to use. Kibana reads your Elasticsearch mapping to find your time fields - select one from the list and hit *Create*.

Congratulations, you have an index pattern! You should now be looking at a paginated list of the fields in your index or indices, as well as some informative data about them. Kibana has automatically set this new index pattern as your default index pattern. If you'd like to know more about index patterns, pop into to the [Settings](#settings) section of the documentation.

**Did you know:** Both *indices* and *indexes* are acceptable plural forms of the word *index*. Knowledge is power.

Now that you've configured an index pattern, you're ready to hop over to the [Discover](#discover) screen and try out a few searches. Click on **Discover** in the navigation bar at the top of the screen.

## Documentation

Visit [Elastic.co](http://www.elastic.co/guide/en/kibana/current/index.html) for the full Kibana documentation.

## Snapshot Builds

For the daring, snapshot builds are available. These builds are created after each commit to the master branch, and therefore are not something you should run in production.

| platform |  |  |  |  |
| --- | --- | --- | --- | --- |
| OSX | [tar](http://download.elastic.co/kibana/kibana-snapshot/kibana-4.5.4-snapshot-darwin-x64.tar.gz) | [zip](http://download.elastic.co/kibana/kibana-snapshot/kibana-4.5.4-snapshot-darwin-x64.zip) |  |  |
| Linux x64 | [tar](http://download.elastic.co/kibana/kibana-snapshot/kibana-4.5.4-snapshot-linux-x64.tar.gz) | [zip](http://download.elastic.co/kibana/kibana-snapshot/kibana-4.5.4-snapshot-linux-x64.zip) | [deb](https://download.elastic.co/kibana/kibana-snapshot/kibana_4.5.4-snapshot_amd64.deb)| [rpm](https://download.elastic.co/kibana/kibana-snapshot/kibana-4.5.4_snapshot-1.x86_64.rpm) |
| Linux x86 | [tar](http://download.elastic.co/kibana/kibana-snapshot/kibana-4.5.4-snapshot-linux-x86.tar.gz) | [zip](http://download.elastic.co/kibana/kibana-snapshot/kibana-4.5.4-snapshot-linux-x86.zip) | [deb](https://download.elastic.co/kibana/kibana-snapshot/kibana_4.5.4-snapshot_i386.deb) | [rpm](https://download.elastic.co/kibana/kibana-snapshot/kibana-4.5.4_snapshot-1.i386.rpm) |
| Windows | [tar](http://download.elastic.co/kibana/kibana-snapshot/kibana-4.5.4-snapshot-windows.tar.gz) | [zip](http://download.elastic.co/kibana/kibana-snapshot/kibana-4.5.4-snapshot-windows.zip) |  |  |
