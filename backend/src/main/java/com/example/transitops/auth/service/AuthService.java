package com.example.transitops.auth.service;

import com.example.transitops.auth.dto.LoginRequest;
import com.example.transitops.auth.dto.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
}
