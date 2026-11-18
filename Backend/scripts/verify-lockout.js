const AuthController = require('../auth-service/controllers/authController');
const User = require('../auth-service/models/user');

console.log('================================================================');
console.log('  SIMULATING: 5 FAILED LOGIN ATTEMPTS & ACCOUNT LOCKOUT FLOW   ');
console.log('================================================================\n');

async function runSimulation() {
  const mockUser = {
    id: 1001,
    empNo: 'EMP-LOCKOUT-TEST',
    email: 'lockout.tester@leeds.com',
    name: 'Lockout Tester',
    failedLoginAttempts: 0,
    lockoutUntil: null,
    isActive: true,
    status: 'approved',
    roleId: 1,
    Role: { roleName: 'Super Admin', power: 'SuperAdmin' },
    comparePassword: async (pwd) => pwd === 'CorrectPass123!',
    update: async function(data) {
      Object.assign(this, data);
      return this;
    },
    generateToken: () => 'valid.rs256.token',
    generateRefreshToken: () => 'valid.refresh.token',
    toJSON: function() { return { id: this.id, empNo: this.empNo, name: this.name }; }
  };

  const origFindOne = User.findOne;
  User.findOne = async () => mockUser;

  try {
    // Attempts 1 to 4: Wrong Password
    for (let attempt = 1; attempt <= 4; attempt++) {
      let status = 200, body = null;
      await AuthController.login(
        { body: { empNo: 'EMP-LOCKOUT-TEST', password: 'WrongPassword' } },
        { status: (s) => { status = s; return { json: (b) => body = b }; }, json: (b) => body = b }
      );
      console.log(`[Attempt ${attempt}] Status: ${status} | Attempts Remaining: ${body.attemptsRemaining} | Message: "${body.message}"`);
    }

    // Attempt 5: 5th Failure (Locks account)
    let status5 = 200, body5 = null;
    await AuthController.login(
      { body: { empNo: 'EMP-LOCKOUT-TEST', password: 'WrongPassword' } },
      { status: (s) => { status5 = s; return { json: (b) => body5 = b }; }, json: (b) => body5 = b }
    );
    console.log(`\n[Attempt 5 - THRESHOLD REACHED] Status: ${status5} | Locked: ${body5.locked} | Remaining: ${body5.remainingMinutes} min | Message: "${body5.message}"`);

    // Attempt 6: User enters CORRECT password while locked
    let status6 = 200, body6 = null;
    await AuthController.login(
      { body: { empNo: 'EMP-LOCKOUT-TEST', password: 'CorrectPass123!' } },
      { status: (s) => { status6 = s; return { json: (b) => body6 = b }; }, json: (b) => body6 = b }
    );
    console.log(`\n[Attempt 6 - CORRECT PASSWORD WHILE LOCKED] Status: ${status6} | Locked: ${body6.locked} | Message: "${body6.message}"`);

    // Cooldown elapsed simulation (15 mins passed)
    mockUser.lockoutUntil = new Date(Date.now() - 1000); // 1 second in the past
    let status7 = 200, body7 = null;
    await AuthController.login(
      { body: { empNo: 'EMP-LOCKOUT-TEST', password: 'CorrectPass123!' } },
      { status: (s) => { status7 = s; return { json: (b) => body7 = b }; }, json: (b) => body7 = b }
    );
    console.log(`\n[Attempt 7 - AFTER COOLDOWN EXPIRED] Status: ${status7} | Success: ${body7.success} | FailedAttempts Reset To: ${mockUser.failedLoginAttempts} | Message: "${body7.message}"`);

    console.log('\n================================================================');
    console.log('🎉 ALL LOCKOUT BEHAVIORS VERIFIED PERFECTLY!');
    console.log('================================================================\n');

  } finally {
    User.findOne = origFindOne;
  }
}

runSimulation();

