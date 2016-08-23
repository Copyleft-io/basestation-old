# Ensure the following environment variables are assigned:
#     BASESTATION_DEVICES_URI: your firebase devices uri, eg "https://basestation.firebaseio.com/devices",
#     BASESTATION_SECRET: your firebase secret
#     CHEF_USERNAME: your chef username
#     CHEF_KEY: Path to your chef key, eg "/tmp/key.pem"
#     CHEF_ORGANIZATION:  Name of your chef org
#     CHEF_URL: url path to your chef org


path                    = require 'path'
ChefApi                 = require 'chef-api'
Firebase                = require 'firebase'
FirebaseTokenGenerator  = require 'firebase-token-generator'
fs                      = require 'fs'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

chef = new ChefApi();

nconf = require 'nconf'
nconf.file file: 'config.json'

devices = new Firebase nconf.get('BASESTATION_DEVICES_URI')

unless nconf.get('BASESTATION_SECRET')?
  console.warn "[WARN] BASESTATION_SECRET not set. Not attempting to authenticate"

unless nconf.get('BASESTATION_DEVICES_URI')?
  console.error "[ERROR] BASESTATION_DEVICES_URI not set."
  process.exit()

if nconf.get('BASESTATION_SECRET')?
  console.info "basestation: Attempting to authenticate using BASESTATION_SECRET"

  tokenGenerator = new FirebaseTokenGenerator nconf.get('BASESTATION_SECRET')
  token = tokenGenerator.createToken { "uid": "custom:BASESTATION_SECRET", "BASESTATION_SECRET": true }
  devices.authWithCustomToken token, (error) ->
    if error
      return console.error '[ERROR] Basestation: Login Failed!', error
    else
      return console.info '[INFO] Basestation: Authenticated successfully'

chef.config
  user_name: nconf.get('CHEF_USERNAME')
  key_path: nconf.get('CHEF_KEY')
  organization: nconf.get('CHEF_ORGANIZATION')
  url: nconf.get('CHEF_URL')

getDeviceFromFirebase  = (node, callback) ->
  if typeof node == 'string'
    return chef.getNode node, (err, res) ->
      return callback err if err
      getDeviceFromFirebase res, callback

  console.log 'getting device ' + node.name

  devices.orderByChild('name').equalTo(node.name).limitToFirst(1).once 'value', (snapshot) ->

    if snapshot.exists()
      console.log '[INFO] Device found'
      existing_device = snapshot.val()
      id = snapshot.key()
      for id of snapshot.val()
        device = devices.child(id)

    else
      console.log '[INFO] Could not find device. Creating a new one.'
      ref = devices.push {}
      device = ref
      device.update
        createdAt: Firebase.ServerValue.TIMESTAMP
        tags: node.automatic?.roles.map (x) ->
          return text:x

    device.update
      name: node.name
      updatedAt: node.automatic.ohai_time or Firebase.ServerValue.TIMESTAMP
      environment: node.chef_environment.toUpperCase()
      createdBy: 'chef-sync'
      description: "Yet another device running #{node.automatic?.roles.join(', ') or 'well.. not sure what it runs. Update me'}."
      private_ip: node.automatic?.ipaddress or 'Unknown'
      status: 'active'
      os: "#{node.automatic.platform or ''} #{node.automatic.platform_version}" or 'Unknown'
      cpu: node.automatic.cpu.cores or 'Unknown'
      ram: node.automatic.memory.total.replace(/kb/i, '') or 'Unknown'
      disk: node.automatic.filesystem2?.by_mountpoint?['/']?.kb_size or 'Unknown'

    callback null, device

chef.getNodes (err, res) ->
  for node, address of res
    console.log node

    getDeviceFromFirebase node, (err, res) ->
      console.log err if err
      #TODO: exit firebase
