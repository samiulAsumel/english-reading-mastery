'use strict';

/**
 * The three content collections the site builds: reading (the original
 * course), writing, and speaking. This is the single place that maps a
 * track to its content directory, route, and curriculum data — every
 * generalized page/build function takes one of these as `collection`
 * instead of hard-coding "lessons". See CLAUDE.md's approved plan
 * ("Writing & Speaking Tracks — Platform + Level 1 Pilot") §0.1/§0.6.
 *
 * Reading's own dir/route/label stay exactly what they always were, so
 * this refactor changes zero behavior for existing reading content.
 */
const readingModules = require('./modules');
const writingModules = require('./writing-modules');
const speakingModules = require('./speaking-modules');
const readingSkills = require('./skills');
const writingSkills = require('./writing-skills');
const speakingSkills = require('./speaking-skills');

const COLLECTIONS = {
  reading: {
    key: 'reading',
    dirName: 'lessons',
    dirPrefix: 'lesson',
    fileName: 'lesson.md',
    routeBase: '/lessons/',
    itemNoun: 'Lesson',
    itemNounPlural: 'Lessons',
    progressKey: 'lessons',
    navLabel: 'Lessons',
    modules: readingModules.modules,
    getModule: readingModules.getModule,
    getModulesForLevel: readingModules.getModulesForLevel,
    suggestPlacement: readingModules.suggestPlacement,
    skills: readingSkills.skills,
    groupLabels: readingSkills.GROUP_LABELS,
  },
  writing: {
    key: 'writing',
    dirName: 'writing',
    dirPrefix: 'writing',
    fileName: 'lesson.md',
    routeBase: '/writing/',
    itemNoun: 'Task',
    itemNounPlural: 'Writing Tasks',
    progressKey: 'writing',
    navLabel: 'Writing',
    modules: writingModules.modules,
    getModule: writingModules.getModule,
    getModulesForLevel: writingModules.getModulesForLevel,
    suggestPlacement: writingModules.suggestPlacement,
    skills: writingSkills.skills,
    groupLabels: writingSkills.GROUP_LABELS,
  },
  speaking: {
    key: 'speaking',
    dirName: 'speaking',
    dirPrefix: 'speaking',
    fileName: 'lesson.md',
    routeBase: '/speaking/',
    itemNoun: 'Drill',
    itemNounPlural: 'Speaking Drills',
    progressKey: 'speaking',
    navLabel: 'Speaking',
    modules: speakingModules.modules,
    getModule: speakingModules.getModule,
    getModulesForLevel: speakingModules.getModulesForLevel,
    suggestPlacement: speakingModules.suggestPlacement,
    skills: speakingSkills.skills,
    groupLabels: speakingSkills.GROUP_LABELS,
  },
};

const COLLECTION_LIST = [COLLECTIONS.reading, COLLECTIONS.writing, COLLECTIONS.speaking];

function getCollection(key) {
  return COLLECTIONS[key];
}

module.exports = { COLLECTIONS, COLLECTION_LIST, getCollection };
