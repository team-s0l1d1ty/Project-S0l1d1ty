import * as Kilt from '@kiltprotocol/sdk-js'

// returns CTYPE from a schema
export function getDriverLicenseSchema(): Kilt.CType {
  return Kilt.CType.fromSchema({
    $schema: 'http://kilt-protocol.org/draft-01/ctype#',
    title: 'Drivers License',
    properties: {
      citizenship: {
        type: 'string'
      },
      citizenid: {
        type: 'string'
      },
      name: {
        type: 'string'
      },
      address: {
        type: 'string'
      }
    },
    type: 'object'
  })
}

export function getEmailSchema(): Kilt.CType {
  return Kilt.CType.fromSchema({
    $schema: "http://kilt-protocol.org/draft-01/ctype#",
    properties: {
        Email: {
            type: "string"
        }
    },
    title: "Email",
    type: "object"
})
}