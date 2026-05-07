import { g } from 'genshin-ts/runtime/core'

function gstsServerAdd(a: bigint, b: bigint) {
  return a + b
}

g.server({
  id: 1073741826,
  variables: {
    cashA: [2000n, 2000n],
    cashB: list('int', [2000n, 2000n]),
    cashC: list('int', new Array(2)),
    cashD: list('int', [-1n, -1n]),
    tags: list('str', ['A', 'B'])
  }
}).on('whenEntityIsCreated', (_evt, f) => {
  const a0 = f.get('cashA')[0]
  const b0 = f.get('cashB')[0]
  const c0 = f.get('cashC')[0]
  const d0 = f.get('cashD')[0]

  const a1 = gstsServerAdd(a0, 1n)
  const b1 = gstsServerAdd(b0, 1n)
  const c1 = gstsServerAdd(c0, 1n)
  const d1 = gstsServerAdd(d0, 1n)

  const cashA = f.get('cashA')
  cashA[0] = a1
  f.set('cashA', cashA)

  const cashB = f.get('cashB')
  cashB[0] = b1
  f.set('cashB', cashB)

  const cashC = f.get('cashC')
  cashC[0] = c1
  f.set('cashC', cashC)

  const cashD = f.get('cashD')
  cashD[0] = d1
  f.set('cashD', cashD)

  f.printString(str(a1))
  f.printString(str(b1))
  f.printString(str(c1))
  f.printString(str(d1))
  f.printString(f.get('tags')[0])
})
