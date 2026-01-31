
console.log("auth starts");

import { supabaseClient } from './supabase.js';

export async function loginUser(username, password) {
    const { data, error } = await supabaseClient
        .from('employees')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .maybeSingle();
    
    return { data, error };
}

export function logout() {
    localStorage.removeItem('currentUser');
    window.location.reload();
}
