/* global expect */
/* global jest */
/* global describe */
/* global test */
const nock = require('nock')
const {
  i18n,
  getFilePath,
  getHookGitHub,
  getHookGitLab,
  getHookSkoHub,
  isValid,
  isSecured,
  getRepositoryFiles
} = require('../src/common')

describe('isSecured', () => {

  test('Is a secure payload', () => {
    expect(isSecured('sha1=5d61605c3feea9799210ddcb71307d4ba264225f', {}, 'secret')).toBe(true)
  })

  test('Is not a secure payload', () => {
    const original = console.warn // Not show warn for test
    console.warn = jest.fn()
    expect(isSecured('wrong signature', {}, 'secret')).toBe(false)
    console.warn = original
  })

  test('Does not crash if the parameters are not present', () => {
    expect(isSecured(null, null, null)).toBe(false)
  })

})

describe('isValid', () => {

  test('The hook should be invalid since is not push', () => {
    expect(isValid({
      isPush: false,
      repository: 'user/reponame',
      ref: 'refs/heads/master',
    })).toBe(false)
  })

  test('The hook should be invalid since the repositioty is invalid', () => {
    expect(isValid({
      isPush: true,
      repository: 'invalidreponame',
      ref: 'refs/heads/master',
    })).toBe(false)
  })

  test('The hook should be invalid since the ref is invalid', () => {
    expect(isValid({
      isPush: true,
      repository: 'invalidreponame',
      ref: 'master',
    })).toBe(false)
  })

  test('The hook should be invalid since the repository is invalid', () => {
    expect(isValid({
      isPush: true,
      repository: 'user@reponame',
      ref: 'refs/heads/master',
    })).toBe(false)
  })

  test('The hook should be invalid since the hook is missing all properties', () => {
    expect(isValid({})).not.toBe(true)
  })

  test('The hook should be valid', () => {
    expect(isValid({
      isPush: true,
      repository: 'user/reponame',
      ref: 'refs/heads/master',
    })).toBe(true)
  })
})

describe('getHookGitHub', () => {

  test('Should not fail if all information is missing', () => {
    expect(getHookGitHub(null, null, null)).toStrictEqual({
      "headers": null,
      "isPush": false,
      "isSecured": false,
      "ref": null,
      "repository": null,
      "type": "github"
    })
  })

  test('Should correctly validate the push event', () => {
    expect(
      getHookGitHub({
        'x-github-event': 'push'
      }, null, null)).toStrictEqual({
        "headers": {
          "x-github-event": "push",
          "x-hub-signature": "*******************"
        },
        "isPush": true,
        "isSecured": false,
        "ref": null,
        "repository": null,
        "type": "github"
      })
    expect(
      getHookGitHub({
        'x-github-event': 'incorrect'
      }, null, null)).toStrictEqual({
        "headers": {
          "x-github-event": "incorrect",
          "x-hub-signature": "*******************"
        },
        "isPush": false,
        "isSecured": false,
        "ref": null,
        "repository": null,
        "type": "github"
      })
  })


  test('Has a repository', () => {
    expect(getHookGitHub(null, {
      repository: {
        full_name: 'testing'
      }
    }, null)).toStrictEqual({
      "headers": null,
      "isPush": false,
      "isSecured": false,
      "ref": null,
      "repository": 'testing',
      "type": "github"
    })
    expect(getHookGitHub(null, {
      repository: {
      }
    }, null)).toStrictEqual({
      "headers": null,
      "isPush": false,
      "isSecured": false,
      "ref": null,
      "repository": null,
      "type": "github"
    })
  })

  test('Has a ref', () => {
    expect(getHookGitHub(null, {
      ref: "refs/heads/master"
    }, null)).toStrictEqual({
      "headers": null,
      "isPush": false,
      "isSecured": false,
      "ref": "refs/heads/master",
      "repository": null,
      "type": "github"
    })
  })

  test('Is secured and the signature is hidden', () => {
    expect(getHookGitHub({
      'x-hub-signature': 'sha1=5d61605c3feea9799210ddcb71307d4ba264225f'
    }, {}, 'secret')).toStrictEqual({
      "headers": {
        "x-hub-signature": "*******************",
      },
      "isPush": false,
      "isSecured": true,
      "ref": null,
      "repository": null,
      "type": "github"
    })
  })

  test('Is a completely valid object', () => {
    const hook = getHookGitHub(
      {
        'x-github-event': 'push',
        'x-hub-signature': 'sha1=3ac16a2fc8b832e7f3e55164ed285e0ebcd097f2'
      },
      {
        repository: {
          "full_name": "dobladov/testTTL"
        },
        ref: "refs/heads/master"
      }, 'secret')

    expect(hook.isSecured).toBe(true)
    expect(isValid(hook)).toBe(true)
  })
})

describe('getHookGitLab', () => {

  test('Should not fail if all information is missing', () => {
    expect(getHookGitLab(null, null, null)).toStrictEqual({
      "headers": null,
      "isPush": false,
      "isSecured": false,
      "ref": null,
      "repository": null,
      "type": "gitlab"
    })
  })

  test('Should correctly validate the push event', () => {
    expect(
      getHookGitLab({
        'x-gitlab-event': 'Push Hook'
      }, null, null)).toStrictEqual({
        "headers": {
          "x-gitlab-event": "Push Hook",
          "x-gitlab-token": "*******************"
        },
        "isPush": true,
        "isSecured": false,
        "ref": null,
        "repository": null,
        "type": "gitlab"
      })
    expect(
      getHookGitLab({
        'x-gitlab-event': 'incorrect'
      }, null, null)).toStrictEqual({
        "headers": {
          "x-gitlab-event": "incorrect",
          "x-gitlab-token": "*******************"
        },
        "isPush": false,
        "isSecured": false,
        "ref": null,
        "repository": null,
        "type": "gitlab"
      })
  })

  test('Has a repository', () => {
    expect(getHookGitLab(null, {
      project: {
        path_with_namespace: 'testing'
      }
    }, null)).toStrictEqual({
      "headers": null,
      "isPush": false,
      "isSecured": false,
      "ref": null,
      "repository": 'testing',
      "type": "gitlab"
    })
    expect(getHookGitLab(null, {
      project: {
      }
    }, null)).toStrictEqual({
      "headers": null,
      "isPush": false,
      "isSecured": false,
      "ref": null,
      "repository": null,
      "type": "gitlab"
    })
  })

  test('Has a ref', () => {
    expect(getHookGitLab(null, {
      ref: "refs/heads/master"
    }, null)).toStrictEqual({
      "headers": null,
      "isPush": false,
      "isSecured": false,
      "ref": "refs/heads/master",
      "repository": null,
      "type": "gitlab"
    })
  })

  test('Is secured and the signature is hidden', () => {
    expect(getHookGitLab({
      'x-gitlab-token': 'secret'
    }, {}, 'secret')).toStrictEqual({
      "headers": {
        "x-gitlab-token": "*******************",
      },
      "isPush": false,
      "isSecured": true,
      "ref": null,
      "repository": null,
      "type": "gitlab"
    })
  })

  test('Is a completely valid object', () => {
    const hook = getHookGitLab(
      {
        'x-gitlab-event': 'Push Hook',
        'x-gitlab-token': 'secret'
      },
      {
        project: {
          "path_with_namespace": "dobladov/testTTL"
        },
        ref: "refs/heads/master"
      }, 'secret')

    expect(hook.isSecured).toBe(true)
    expect(isValid(hook)).toBe(true)
  })
})

describe('getHookSkoHub', () => {

  test('Should not fail if all information is missing', () => {
    expect(getHookSkoHub(null, null, null)).toStrictEqual({
      "headers": null,
      "isPush": false,
      "isSecured": false,
      "ref": null,
      "repository": null,
      "filesURL": null,
      "type": "skohub"
    })
  })

  test('Should correctly validate the push event', () => {
    expect(
      getHookSkoHub({
        'x-skohub-event': 'push'
      }, null, null)).toStrictEqual({
        "headers": {
          "x-skohub-event": "push",
          "x-skohub-token": "*******************"
        },
        "isPush": true,
        "isSecured": false,
        "ref": null,
        "repository": null,
        "filesURL": null,
        "type": "skohub"
      })
    expect(
      getHookSkoHub({
        'x-skohub-event': 'incorrect'
      }, null, null)).toStrictEqual({
        "headers": {
          "x-skohub-event": "incorrect",
          "x-skohub-token": "*******************"
        },
        "isPush": false,
        "isSecured": false,
        "ref": null,
        "repository": null,
        "filesURL": null,
        "type": "skohub"
      })
  })

  test('Has a repository', () => {
    expect(getHookSkoHub(null, {
      repository: {
        full_name: 'testing'
      }
    }, null)).toStrictEqual({
      "headers": null,
      "isPush": false,
      "isSecured": false,
      "ref": null,
      "repository": 'testing',
      "filesURL": null,
      "type": "skohub"
    })
    expect(getHookSkoHub(null, {
      project: {
      }
    }, null)).toStrictEqual({
      "headers": null,
      "isPush": false,
      "isSecured": false,
      "ref": null,
      "repository": null,
      "filesURL": null,
      "type": "skohub"
    })
  })

  test('Has a ref', () => {
    expect(getHookSkoHub(null, {
      ref: "refs/heads/master"
    }, null)).toStrictEqual({
      "headers": null,
      "isPush": false,
      "isSecured": false,
      "ref": "refs/heads/master",
      "repository": null,
      "filesURL": null,
      "type": "skohub"
    })
  })

  test('Is secured and the signature is hidden', () => {
    expect(getHookSkoHub({
      'x-skohub-token': 'secret'
    }, {}, 'secret')).toStrictEqual({
      "headers": {
        "x-skohub-token": "*******************",
      },
      "isPush": false,
      "isSecured": true,
      "ref": null,
      "repository": null,
      "filesURL": null,
      "type": "skohub"
    })
  })

  test('Is a completely valid object', () => {
    const hook = getHookSkoHub(
      {
        'x-skohub-event': 'push',
        'x-skohub-token': 'secret'
      },
      {
        repository: {
          "full_name": "dobladov/testTTL"
        },
        ref: "refs/heads/master"
      }, 'secret')

    expect(hook.isSecured).toBe(true)
    expect(isValid(hook)).toBe(true)
  })
})


describe('getRepositoryFiles', () => {

  test('Should return the valid file for the given type github', async () => {

    nock('https://api.github.com')
      .get('/repos/dobladov/testTTL/contents/')
      .query({"ref":"master"})
      .reply(200, [
        {
          "name": "esc.ttl",
          "path": "esc.ttl",
          "sha": "f304ffef3df045061daf7700503d7cdd79cbc040",
          "size": 24585,
          "url": "https://api.github.com/repos/dobladov/testTTL/contents/esc.ttl?ref=master",
          "html_url": "https://github.com/dobladov/testTTL/blob/master/esc.ttl",
          "git_url": "https://api.github.com/repos/dobladov/testTTL/git/blobs/f304ffef3df045061daf7700503d7cdd79cbc040",
          "download_url": "https://raw.githubusercontent.com/dobladov/testTTL/master/esc.ttl",
          "type": "file",
          "_links": {
            "self": "https://api.github.com/repos/dobladov/testTTL/contents/esc.ttl?ref=master",
            "git": "https://api.github.com/repos/dobladov/testTTL/git/blobs/f304ffef3df045061daf7700503d7cdd79cbc040",
            "html": "https://github.com/dobladov/testTTL/blob/master/esc.ttl"
          }
        },
        {
          "name": "hochschulfaecher.ttl",
          "path": "hochschulfaecher.ttl",
          "sha": "7f59f2e2fe0ff7f5d8a90a23949fcc1d053f726f",
          "size": 96955,
          "url": "https://api.github.com/repos/dobladov/testTTL/contents/hochschulfaecher.ttl?ref=master",
          "html_url": "https://github.com/dobladov/testTTL/blob/master/hochschulfaecher.ttl",
          "git_url": "https://api.github.com/repos/dobladov/testTTL/git/blobs/7f59f2e2fe0ff7f5d8a90a23949fcc1d053f726f",
          "download_url": "https://raw.githubusercontent.com/dobladov/testTTL/master/hochschulfaecher.ttl",
          "type": "file",
          "_links": {
            "self": "https://api.github.com/repos/dobladov/testTTL/contents/hochschulfaecher.ttl?ref=master",
            "git": "https://api.github.com/repos/dobladov/testTTL/git/blobs/7f59f2e2fe0ff7f5d8a90a23949fcc1d053f726f",
            "html": "https://github.com/dobladov/testTTL/blob/master/hochschulfaecher.ttl"
          }
        }
      ]
    );

    const res = await getRepositoryFiles({
      type: 'github',
      repository: 'dobladov/testTTL',
      ref: 'refs/heads/master'
    })

    expect(res.length).toBe(2)
    expect(res.every(file => file.path && file.url)).toBe(true)
  })

  test('Should return the valid file for the given type gitlab', async () => {

    nock('https://gitlab.com:443', {"encodedQueryParams":true})
      .get('/api/v4/projects/dobladov%2FtestTTL/repository/tree')
      .query({"ref":"refs%2Fheads%2Fmaster"})
      .reply(200, [
        {
          "id": "28941200a5fabbe46aa64bf949e684f4feeab5b2",
          "name": "faecherklassifikation.ttl",
          "type": "blob",
          "path": "faecherklassifikation.ttl",
          "mode": "100644"
        },
        {
          "id": "7f59f2e2fe0ff7f5d8a90a23949fcc1d053f726f",
          "name": "hochschulfaecher.ttl",
          "type": "blob",
          "path": "hochschulfaecher.ttl",
          "mode": "100644"
        }
      ])

    const res = await getRepositoryFiles({
      type: 'gitlab',
      repository: 'dobladov/testTTL',
      ref: 'refs/heads/master'
    })

    expect(res.length).toBe(2)
    expect(res.every(file => file.path && file.url)).toBe(true)
  })

  test('Should return the valid file for the given type skohub', async () => {

    nock('http://localhost:6000')
      .get('/getFiles')
      .reply(200, [{"path":"esc.ttl","url":"http://localhost:6000/download/esc.ttl"}])

    const res = await getRepositoryFiles({
      type: 'skohub',
      repository: 'custom/testTTL',
      ref: 'refs/heads/master',
      filesURL: "http://localhost:6000/getFiles"
    })

    expect(res.length).toBe(1)
    expect(res.every(file => file.path && file.url)).toBe(true)
  })

  test('Should throw error', async () => {

    nock('https://api.github.com')
      .get('/repos/custom/testTTL/contents/')
      .query({"ref":"master"})
      .reply(200, {message: "Not Found"})

    await expect(getRepositoryFiles({
      type: 'github',
      repository: 'custom/testTTL',
      ref: 'refs/heads/master',
    })).rejects.toThrow("Not Found")
  })

  test('Should throw error', async () => {

     nock('https://gitlab.com:443', {"encodedQueryParams":true})
      .get('/api/v4/projects/custom%2FtestTTL/repository/tree')
      .query({"ref":"refs%2Fheads%2Fmaster"})
      .reply(200, {message: 	"404 Not Found"})

    await expect(getRepositoryFiles({
      type: 'gitlab',
      repository: 'custom/testTTL',
      ref: 'refs/heads/master',
    })).rejects.toThrow("Not Found")
  })

  test('Should throw error', async () => {

     nock('http://localhost:6000')
      .get('/getFiles')
      .reply(200, [{foo: 'bar'}])

    await expect(getRepositoryFiles({
      type: 'skohub',
      repository: 'custom/testTTL',
      ref: 'refs/heads/master',
      filesURL: "http://localhost:6000/getFiles"
    })).rejects.toThrow("Malformed custom files")
  })
})


describe('Translate', () => {

  test('Translates a localized string', () => {
    const localized = { en_us: null, en: null, de: 'Südostasien und Ozeanien' }
    expect(i18n('de')(localized)).toBe("Südostasien und Ozeanien")
  })

  test('Should return an empty string', () => {
    const localized = { en_us: null, en: null, de: null }
    expect(i18n('de')(localized)).toBe("")
  })

})

describe('getFilePath', () => {

  test('Should return a valid path', () => {
    expect(getFilePath("http://w3id.org/class/hochschulfaecher/S393#", "html"))
      .toBe('/w3id.org/class/hochschulfaecher/S393.html')
  })
})
